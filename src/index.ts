const kContextIdFunctionPrefix = "_context_id_";
const kContextIdRegex = new RegExp(`_${kContextIdFunctionPrefix}_([0-9a-zA-Z]{32})_([0-9a-zA-Z]{32})_(\\d+)__`);

const randomUUID = (): string => {
	return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0;
		const v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

const runCallback = (callback: (data: any) => void, data: any) => {
	try {
		callback(data);
	} catch (err) {
		console.error("Error in subscription callback", err);
	}
};

const cloneValue = <T>(obj: T, seen: Map<any, any> = new Map()): T => {
	// Handle the 3 simple types, and null or undefined
	if (obj === null || typeof obj !== "object") return obj;

	// Handle Date
	if (obj instanceof Date) {
		return new Date(obj.getTime()) as any;
	}

	// Handle previously seen objects to avoid circular references
	if (seen.has(obj)) {
		return seen.get(obj);
	}

	// Handle Array
	if (obj instanceof Array) {
		const copy: any[] = [];
		seen.set(obj, copy); // Add to seen map
		for (let i = 0, len = obj.length; i < len; i++) {
			copy[i] = cloneValue(obj[i], seen);
		}
		return copy as any;
	}

	// Handle Object
	if (obj instanceof Object) {
		const copy: Record<string, any> = {};
		seen.set(obj, copy); // Add to seen map
		for (let attr in obj as any) {
			if ((obj as any).hasOwnProperty(attr)) {
				copy[attr] = cloneValue((obj as any)[attr], seen);
			}
		}
		return copy as any;
	}

	return obj;
};

interface SimpleEventEmitterProperty {
	stop: () => void;
}

class SimpleEventEmitter {
	private subscriptions: {
		event: string;
		callback: (data: any) => void;
		once: boolean;
	}[];

	private oneTimeEvents: Map<string, any>;

	constructor() {
		this.subscriptions = [];
		this.oneTimeEvents = new Map();
	}

	on<T>(event: string, callback: (data: T) => void): SimpleEventEmitterProperty {
		if (this.oneTimeEvents.has(event)) {
			runCallback(callback, this.oneTimeEvents.get(event));
		} else {
			this.subscriptions.push({ event, callback, once: false });
		}
		const self = this;
		return {
			stop() {
				self.off(event, callback);
			},
		};
	}

	off<T>(event: string, callback?: (data: T) => void) {
		this.subscriptions = this.subscriptions.filter((s) => s.event !== event || (callback && s.callback !== callback));
		return this;
	}

	once<T>(event: string, callback?: (data: T) => void): Promise<T> {
		return new Promise<T>((resolve) => {
			const ourCallback = (data: T) => {
				resolve(data);
				callback?.(data);
			};
			if (this.oneTimeEvents.has(event)) {
				runCallback(ourCallback, this.oneTimeEvents.get(event));
			} else {
				this.subscriptions.push({
					event,
					callback: ourCallback,
					once: true,
				});
			}
		});
	}

	emit(event: string, data?: any) {
		if (this.oneTimeEvents.has(event)) {
			throw new Error(`Event "${event}" was supposed to be emitted only once`);
		}
		for (let i = 0; i < this.subscriptions.length; i++) {
			const s = this.subscriptions[i];
			if (s.event !== event) {
				continue;
			}
			runCallback(s.callback, data);
			if (s.once) {
				this.subscriptions.splice(i, 1);
				i--;
			}
		}
		return this;
	}

	emitOnce(event: string, data?: any) {
		if (this.oneTimeEvents.has(event)) {
			throw new Error(`Event "${event}" was supposed to be emitted only once`);
		}
		this.emit(event, data);
		this.oneTimeEvents.set(event, data); // Mark event as being emitted once for future subscribers
		this.off(event); // Remove all listeners for this event, they won't fire again
		return this;
	}
}

class ContextValue<T, C extends Object> {
	private _value: T;
	private _cache: C;

	constructor(value: T) {
		this._value = cloneValue(value);
		this._cache = {} as C;
	}

	get value() {
		return this._value;
	}

	set value(value: T) {
		this._value = value;
	}

	get cache() {
		const self = this;
		return {
			get: (id: keyof C) => (id in self._cache ? self._cache[id] : undefined),
			set: (id: keyof C, value: C[typeof id]) => (self._cache[id] = value),
			delete: (id: keyof C) => delete self._cache[id],
			clear: () => (self._cache = {} as C),
			has: (id: string) => id in self._cache,
		};
	}
}

interface ContextOptions {
	individual: boolean;
}

const joinObject = <T extends Record<string, any>>(obj: T, partial: Partial<T>): T => {
	const newObj: T = { ...obj };
	for (const key in partial) {
		if (partial.hasOwnProperty(key)) {
			newObj[key] = partial[key] ?? obj[key];
		}
	}
	return newObj;
};

class Context<
	T,
	C extends Object = {
		[key: string]: any;
	},
> extends SimpleEventEmitter {
	readonly constextId = randomUUID();
	readonly processLength = new Map<string, number>();
	readonly contexts = new Map<string, ContextValue<T, C>>();
	readonly events: Record<
		string,
		{
			event: string;
			callback: any;
		}[]
	> = {};
	private readonly options: ContextOptions;

	constructor(private _defaultValue: T, options: Partial<ContextOptions> = {}) {
		super();
		this.options = joinObject<ContextOptions>({ individual: false }, options);
	}

	get defaultValue() {
		return cloneValue(this._defaultValue);
	}

	on<D = { contextId: string; value: T }>(event: "context", callback: (data: D) => void): SimpleEventEmitterProperty;
	on(event: string, callback: any): SimpleEventEmitterProperty {
		const id = this.getContextId();
		const evn = super.on(event, callback);
		if (this.contexts.has(id)) {
			if (!Array.isArray(this.events[id])) {
				this.events[id] = [];
			}
			this.events[id].push({ event, callback });
			return evn;
		} else {
			evn.stop();
			return evn;
		}
	}

	once<D = { contextId: string; value: T }>(event: "context", callback: (data: D) => void): Promise<D>;
	once(event: string, callback: any): Promise<any> {
		const id = this.getContextId();
		if (this.contexts.has(id)) {
			if (!Array.isArray(this.events[id])) {
				this.events[id] = [];
			}
			this.events[id].push({ event, callback });
			return super.once(event, callback);
		} else {
			return Promise.reject();
		}
	}

	off<D = { contextId: string; value: T }>(event: "context", callback: (data: D) => void): this;
	off(event: string, callback?: any): this {
		super.off(event, callback);
		return this;
	}

	emit<D = { contextId: string; value: T }>(event: "context", data: D): this;
	emit(event: string, data?: any): this {
		super.emit(event, data);
		return this;
	}

	emitOnce<D = { contextId: string; value: T }>(event: "context", data: D): this;
	emitOnce(event: string, data?: any): this {
		super.emitOnce(event, data);
		return this;
	}

	provider<A extends any[], R = any | void>(target: (...args: A) => Promise<R> | R, defaultValue: T = this.defaultValue) {
		const self = this;
		return async function (this: any, ...args: A) {
			const contextId = self.options.individual ? randomUUID() : self.getContextId();

			if (!self.contexts.has(contextId)) {
				self.contexts.set(contextId, new ContextValue(defaultValue ?? this._defaultValue));
			}
			self.processLength.set(contextId, (self.processLength.get(contextId) ?? 0) + 1);

			let proxy: (this: any, t: (...args: A) => Promise<R> | R, ...a: A) => Promise<R> = () => Promise.resolve() as any;

			const fnName = `_${kContextIdFunctionPrefix}_${self.constextId}_${contextId}_${Date.now()}__`;

			eval(
				`proxy = async function ${fnName}(target, ...args){
                    return await Promise.race([target.apply(this, args)]);
                }`,
			);

			let result: R | undefined = undefined,
				error: Error | undefined = undefined;

			try {
				result = await (proxy as any).call(this, target, ...args);
			} catch (e) {
				error = new Error(e as any);
			}

			const length = self.processLength.get(contextId) ?? 0;
			if (length <= 1) {
				self.contexts.delete(contextId);
				self.processLength.delete(contextId);
				(self.events[contextId] ?? []).splice(0).forEach(({ event, callback }) => {
					self.off(event as any, callback);
				});
			} else {
				self.processLength.set(contextId, length - 1);
			}

			return error instanceof Error ? Promise.reject(error) : (result as R);
		};
	}

	get value() {
		return this.get();
	}

	set value(value: T) {
		this.set(value);
	}

	get id() {
		return this.getId();
	}

	getId() {
		return this.getContextId();
	}

	get cache() {
		const id = this.getContextId();
		const context = this.contexts.get(id);
		if (!context) {
			return new ContextValue<T, C>(this.defaultValue).cache;
		}
		return context.cache;
	}

	private getContextId(): string {
		Error.stackTraceLimit = Infinity;
		const stack = (new Error().stack ?? "").split("\n");

		for (const frame of stack) {
			const match = frame.match(kContextIdRegex);
			if (!match) {
				continue;
			}

			const contextId = match[1],
				id = match[2];

			if (typeof contextId !== "string" || contextId.trim() === "") {
				continue;
			}

			if (contextId !== this.constextId) {
				continue;
			}

			if (typeof id !== "string" || id.trim() === "") {
				continue;
			}

			return id;
		}

		return randomUUID();
	}

	get(): T {
		const id = this.getContextId();
		return this.contexts.get(id)?.value ?? this.defaultValue;
	}

	set(value: T): T {
		const id = this.getContextId();
		const context = this.contexts.get(id);
		if (context) {
			context.value = value;
		}
		this.emit("context", {
			contextId: id,
			value: value,
		});
		return this.contexts.get(id)?.value ?? value;
	}

	assignValue(value: T): T {
		const context = this.get();

		if (!context) {
			return this.set(value);
		}

		const a_is_obj = ["[object Object]", "[object Array]"].includes(Object.prototype.toString.call(context));
		const b_is_obj = ["[object Object]", "[object Array]"].includes(Object.prototype.toString.call(value));

		if ((a_is_obj && !b_is_obj) || (!a_is_obj && !b_is_obj)) {
			return context;
		} else if (!a_is_obj && b_is_obj) {
			return this.set(value);
		}

		return this.set(Object.assign(context, value));
	}

	proxyValue(): T {
		const context = this.get() ?? {};

		if (!context || typeof context !== "object" || context === null) {
			throw new Error("Context is not an object");
		}

		const self = this;

		return new Proxy(context, {
			get(target: any, prop: string) {
				return target[prop];
			},
			set(target: any, prop: string, value: any) {
				target[prop] = value;
				self.set(target);
				return true;
			},
			deleteProperty(target: any, prop: string) {
				delete target[prop];
				self.set(target);
				return true;
			},
		});
	}
}

/**
 * Cria um novo contexto com um valor padrão.
 *
 * @template T - O tipo do valor padrão do contexto.
 * @template C - O tipo do escopo cache do contexto, que deve ser um objeto. Por padrão, é um objeto genérico com chaves do tipo string e valores de qualquer tipo. Útil apenas em casos específicos onde você deseja armazenar valores em cache no contexto.
 * 
 * @param {T} defaultValue - O valor padrão do contexto.
 * @param {Partial<ContextOptions>} options - Opções para o contexto.
 * @returns {Context<T, C>} Uma nova instância de `Context` com o valor padrão fornecido.
 
 * @example
 * const context = createContext(0);
 *
 * const someFunction = async ()=>{
 *    context.value += 1;
 * };
 *
 * const initialize = context.provider(async function(){
 *     someFunction();
 *     someFunction();
 *     someFunction();
 *     someFunction();
 *     console.log(context.value); // 4
 * });
 *
 * initialize();
 */
export function createContext<
	T,
	C extends Object = {
		[key: string]: any;
	},
>(defaultValue: T, options: Partial<ContextOptions> = {}): Context<T, C> {
	return new Context<T, C>(defaultValue, options);
}

export default createContext;

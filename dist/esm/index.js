const kContextIdFunctionPrefix = "_context_id_";
const kContextIdRegex = new RegExp(`_${kContextIdFunctionPrefix}_([0-9a-zA-Z]{32})_([0-9a-zA-Z]{32})_(\\d+)__`);
import cls from "cls-hooked";
const randomUUID = () => {
    return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
const runCallback = (callback, data) => {
    try {
        callback(data);
    }
    catch (err) {
        console.error("Error in subscription callback", err);
    }
};
const cloneValue = (obj, seen = new Map()) => {
    // Handle the 3 simple types, and null or undefined
    if (!obj || obj === null || typeof obj !== "object")
        return obj;
    // Handle Date
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    // Handle previously seen objects to avoid circular references
    if (seen.has(obj)) {
        return seen.get(obj);
    }
    // Handle Array
    if (obj instanceof Array) {
        const copy = [];
        seen.set(obj, copy); // Add to seen map
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = cloneValue(obj[i], seen);
        }
        return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
        const copy = {};
        seen.set(obj, copy); // Add to seen map
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = cloneValue(obj[attr], seen);
            }
        }
        return copy;
    }
    return obj;
};
class SimpleEventEmitter {
    subscriptions;
    oneTimeEvents;
    constructor() {
        this.subscriptions = [];
        this.oneTimeEvents = new Map();
    }
    on(event, callback) {
        if (this.oneTimeEvents.has(event)) {
            runCallback(callback, this.oneTimeEvents.get(event));
        }
        else {
            this.subscriptions.push({ event, callback, once: false });
        }
        const self = this;
        return {
            stop() {
                self.off(event, callback);
            },
        };
    }
    off(event, callback) {
        this.subscriptions = this.subscriptions.filter((s) => s.event !== event || (callback && s.callback !== callback));
        return this;
    }
    once(event, callback) {
        return new Promise((resolve) => {
            const ourCallback = (data) => {
                resolve(data);
                callback?.(data);
            };
            if (this.oneTimeEvents.has(event)) {
                runCallback(ourCallback, this.oneTimeEvents.get(event));
            }
            else {
                this.subscriptions.push({
                    event,
                    callback: ourCallback,
                    once: true,
                });
            }
        });
    }
    emit(event, data) {
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
    emitOnce(event, data) {
        if (this.oneTimeEvents.has(event)) {
            throw new Error(`Event "${event}" was supposed to be emitted only once`);
        }
        this.emit(event, data);
        this.oneTimeEvents.set(event, data); // Mark event as being emitted once for future subscribers
        this.off(event); // Remove all listeners for this event, they won't fire again
        return this;
    }
}
class ContextValue {
    _value;
    _cache;
    constructor(value) {
        this._value = cloneValue(value);
        this._cache = {};
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    get cache() {
        const self = this;
        return {
            get: (id) => (id in self._cache ? self._cache[id] : undefined),
            set: (id, value) => (self._cache[id] = value),
            delete: (id) => delete self._cache[id],
            clear: () => (self._cache = {}),
            has: (id) => id in self._cache,
        };
    }
}
const joinObject = (obj, partial) => {
    const newObj = { ...obj };
    for (const key in partial) {
        if (partial.hasOwnProperty(key)) {
            newObj[key] = partial[key] ?? obj[key];
        }
    }
    return newObj;
};
class Context extends SimpleEventEmitter {
    _defaultValue;
    constextId = randomUUID();
    processLength = new Map();
    contexts = new Map();
    events = {};
    options;
    ns;
    constructor(_defaultValue, options = {}) {
        super();
        this._defaultValue = _defaultValue;
        this.options = joinObject({ individual: false }, options);
        this.ns = cls.createNamespace(this.constextId);
    }
    get defaultValue() {
        return cloneValue(this._defaultValue);
    }
    on(event, callback) {
        const id = this.getContextId();
        const evn = super.on(event, callback);
        if (this.contexts.has(id)) {
            if (!Array.isArray(this.events[id])) {
                this.events[id] = [];
            }
            this.events[id].push({ event, callback });
            return evn;
        }
        else {
            evn.stop();
            return evn;
        }
    }
    once(event, callback) {
        const id = this.getContextId();
        if (this.contexts.has(id)) {
            if (!Array.isArray(this.events[id])) {
                this.events[id] = [];
            }
            this.events[id].push({ event, callback });
            return super.once(event, callback);
        }
        else {
            return Promise.reject();
        }
    }
    off(event, callback) {
        super.off(event, callback);
        return this;
    }
    emit(event, data) {
        super.emit(event, data);
        return this;
    }
    emitOnce(event, data) {
        super.emitOnce(event, data);
        return this;
    }
    provider(target, defaultValue = this.defaultValue) {
        const self = this;
        return async function (...args) {
            const contextId = self.options.individual ? randomUUID() : self.getContextId();
            if (!self.contexts.has(contextId)) {
                self.contexts.set(contextId, new ContextValue(defaultValue ?? self._defaultValue));
            }
            self.processLength.set(contextId, (self.processLength.get(contextId) ?? 0) + 1);
            return new Promise(async (resolve, reject) => {
                let result = undefined, error = undefined;
                await self.ns.runPromise(async () => {
                    self.ns.set("contextId", contextId);
                    try {
                        result = await Promise.race([target.apply(this, args)]);
                    }
                    catch (e) {
                        error = new Error(e);
                    }
                });
                const length = self.processLength.get(contextId) ?? 0;
                if (length <= 1) {
                    setTimeout(() => {
                        self.contexts.delete(contextId);
                        self.processLength.delete(contextId);
                        (self.events[contextId] ?? []).splice(0).forEach(({ event, callback }) => {
                            self.off(event, callback);
                        });
                    }, 1000);
                }
                else {
                    self.processLength.set(contextId, length - 1);
                }
                if (error instanceof Error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        };
    }
    get value() {
        const id = this.getContextId();
        return this.contexts.get(id)?.value ?? this.defaultValue;
    }
    set value(value) {
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
            return new ContextValue(this.defaultValue).cache;
        }
        return context.cache;
    }
    getContextId() {
        return this.ns.active ? this.ns.get("contextId") : randomUUID();
    }
    get() {
        const id = this.getContextId();
        return this.contexts.get(id)?.value ?? this.defaultValue;
    }
    set(value) {
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
    assignValue(value) {
        const context = this.get();
        if (!context) {
            return this.set(value);
        }
        const a_is_obj = ["[object Object]", "[object Array]"].includes(Object.prototype.toString.call(context));
        const b_is_obj = ["[object Object]", "[object Array]"].includes(Object.prototype.toString.call(value));
        if ((a_is_obj && !b_is_obj) || (!a_is_obj && !b_is_obj)) {
            return context;
        }
        else if (!a_is_obj && b_is_obj) {
            return this.set(value);
        }
        return this.set(Object.assign(context, value));
    }
    proxyValue() {
        const context = this.get() ?? {};
        if (!context || typeof context !== "object" || context === null) {
            throw new Error("Context is not an object");
        }
        const self = this;
        return new Proxy(context, {
            get(target, prop) {
                return target[prop];
            },
            set(target, prop, value) {
                target[prop] = value;
                self.set(target);
                return true;
            },
            deleteProperty(target, prop) {
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
export function createContext(defaultValue, options = {}) {
    return new Context(defaultValue, options);
}
export default createContext;
//# sourceMappingURL=index.js.map
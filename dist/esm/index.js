const kContextIdFunctionPrefix = "_context_id_";
const kContextIdRegex = new RegExp(`_${kContextIdFunctionPrefix}_([0-9a-zA-Z]{32})_([0-9a-zA-Z]{32})_(\\d+)__`);
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
const cloneValue = (obj) => {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj)
        return obj;
    // Handle Date
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    // Handle Array
    if (obj instanceof Array) {
        const copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = cloneValue(obj[i]);
        }
        return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
        const copy = {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr))
                copy[attr] = cloneValue(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
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
class Context extends SimpleEventEmitter {
    _defaultValue;
    id = randomUUID();
    processLength = new Map();
    contexts = new Map();
    events = {};
    constructor(_defaultValue) {
        super();
        this._defaultValue = _defaultValue;
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
            const contextId = self.getContextId();
            if (!self.contexts.has(contextId)) {
                self.contexts.set(contextId, new ContextValue(defaultValue ?? this._defaultValue));
            }
            self.processLength.set(contextId, (self.processLength.get(contextId) ?? 0) + 1);
            let proxy = () => Promise.resolve();
            const fnName = `_${kContextIdFunctionPrefix}_${self.id}_${contextId}_${Date.now()}__`;
            eval(`proxy = async function ${fnName}(target, ...args){
                    return await Promise.race([target.apply(this, args)]);
                }`);
            let result = undefined, error = undefined;
            try {
                result = await proxy.call(this, target, ...args);
            }
            catch (e) {
                error = new Error(e);
            }
            const length = self.processLength.get(contextId) ?? 0;
            if (length <= 1) {
                self.contexts.delete(contextId);
                self.processLength.delete(contextId);
                (self.events[contextId] ?? []).splice(0).forEach(({ event, callback }) => {
                    self.off(event, callback);
                });
            }
            else {
                self.processLength.set(contextId, length - 1);
            }
            return error instanceof Error ? Promise.reject(error) : result;
        };
    }
    get value() {
        return this.get();
    }
    set value(value) {
        this.set(value);
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
        const stack = (new Error().stack ?? "").split("\n");
        for (const frame of stack) {
            const match = frame.match(kContextIdRegex);
            if (!match) {
                continue;
            }
            const contextId = match[1], id = match[2];
            if (typeof contextId !== "string" || contextId.trim() === "") {
                continue;
            }
            if (contextId !== this.id) {
                continue;
            }
            if (typeof id !== "string" || id.trim() === "") {
                continue;
            }
            return id;
        }
        return randomUUID();
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
export function createContext(defaultValue) {
    return new Context(defaultValue);
}
export default createContext;
//# sourceMappingURL=index.js.map
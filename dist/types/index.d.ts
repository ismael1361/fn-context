interface SimpleEventEmitterProperty {
    stop: () => void;
}
declare class SimpleEventEmitter {
    private subscriptions;
    private oneTimeEvents;
    constructor();
    on<T>(event: string, callback: (data: T) => void): SimpleEventEmitterProperty;
    off<T>(event: string, callback?: (data: T) => void): this;
    once<T>(event: string, callback?: (data: T) => void): Promise<T>;
    emit(event: string, data?: any): this;
    emitOnce(event: string, data?: any): this;
}
declare class ContextValue<T, C extends Object> {
    private _value;
    private _cache;
    constructor(value: T);
    get value(): T;
    set value(value: T);
    get cache(): {
        get: (id: keyof C) => C[keyof C] | undefined;
        set: (id: keyof C, value: C[typeof id]) => C[keyof C];
        delete: (id: keyof C) => boolean;
        clear: () => C;
        has: (id: string) => boolean;
    };
}
declare class Context<T, C extends Object = {
    [key: string]: any;
}> extends SimpleEventEmitter {
    private _defaultValue;
    readonly constextId: string;
    readonly processLength: Map<string, number>;
    readonly contexts: Map<string, ContextValue<T, C>>;
    readonly events: Record<string, {
        event: string;
        callback: any;
    }[]>;
    constructor(_defaultValue: T);
    get defaultValue(): T;
    on<D = {
        contextId: string;
        value: T;
    }>(event: "context", callback: (data: D) => void): SimpleEventEmitterProperty;
    once<D = {
        contextId: string;
        value: T;
    }>(event: "context", callback: (data: D) => void): Promise<D>;
    off<D = {
        contextId: string;
        value: T;
    }>(event: "context", callback: (data: D) => void): this;
    emit<D = {
        contextId: string;
        value: T;
    }>(event: "context", data: D): this;
    emitOnce<D = {
        contextId: string;
        value: T;
    }>(event: "context", data: D): this;
    provider<A extends any[], R = any | void>(target: (...args: A) => Promise<R> | R, defaultValue?: T): (this: any, ...args: A) => Promise<R>;
    get value(): T;
    set value(value: T);
    get id(): string;
    getId(): string;
    get cache(): {
        get: (id: keyof C) => C[keyof C] | undefined;
        set: (id: keyof C, value: C[keyof C]) => C[keyof C];
        delete: (id: keyof C) => boolean;
        clear: () => C;
        has: (id: string) => boolean;
    };
    private getContextId;
    get(): T;
    set(value: T): T;
    assignValue(value: T): T;
    proxyValue(): T;
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
export declare function createContext<T, C extends Object = {
    [key: string]: any;
}>(defaultValue: T): Context<T, C>;
export default createContext;
//# sourceMappingURL=index.d.ts.map
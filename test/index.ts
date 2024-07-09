import { createContext } from "../src";

(async () => {
	const DemoContext = createContext<
		{
			title: string;
			id: number;
		},
		{
			B: boolean;
		}
	>({
		title: "",
		id: Date.now(),
	});

	async function A() {
		const id = DemoContext.getContextId();
		console.log(`Function A - ID: ${id}`);
		await B();
		await B();
		await B();
	}

	async function B() {
		if (DemoContext.cache.has("B")) {
			return;
		}

		const id = DemoContext.getContextId();

		await new Promise((resolve) => setTimeout(resolve, 100 * Math.round(Math.random() * 100)));

		console.log(`Function B - ID: ${id}`);

		DemoContext.cache.set("B", true);
		await C();
	}

	async function C() {
		const id = DemoContext.getContextId();
		console.log(`Function C - ID: ${id}`);
		console.log(DemoContext.value);
	}

	await DemoContext.provider(A)();

	await DemoContext.provider(B, { title: "exemplo 02", id: Date.now() })();

	await DemoContext.provider(A, { title: "exemplo 03", id: Date.now() })();

	await DemoContext.provider(C, { title: "exemplo 04", id: Date.now() })();
})();

(async () => {
	const context = createContext(0);

	const someFunction = async () => {
		context.value += 1;
	};

	const initialize = context.provider(async function () {
		someFunction();
		someFunction();
		someFunction();
		someFunction();
		console.log("context", context.value); // 4
	});

	await initialize();
})();

(async () => {
	const context = createContext<{
		foo?: string;
		bar?: string;
		time?: number;
	}>({ foo: "bar" });

	const fn2 = async () => {
		const valor = context.get();
		context.set({ ...valor, time: Date.now() });
	};

	const fn3 = async () => {
		return context.get();
	};

	const fn = async () => {
		await fn2();
		return await fn3();
	};

	context.provider(fn)().then(console.log); // { foo: 'bar', time: 1633661600000 }
	context.provider(fn, { bar: "foo" })().then(console.log); // { bar: 'foo', time: 1633661601000 }
})();

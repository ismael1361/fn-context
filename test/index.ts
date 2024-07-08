import { createContext } from "../src";

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

DemoContext.provider(A)();

DemoContext.provider(B, { title: "exemplo 02", id: Date.now() })();

DemoContext.provider(A, { title: "exemplo 03", id: Date.now() })();

DemoContext.provider(C, { title: "exemplo 04", id: Date.now() })();

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

initialize();

import { evaluateExpression } from "./parser";

describe("Calculator Parser", () => {
	test("basic arithmetic operations", () => {
		expect(evaluateExpression("2+2")).toBe("4");
		expect(evaluateExpression("5-3")).toBe("2");
		expect(evaluateExpression("4*3")).toBe("12");
		expect(evaluateExpression("8/2")).toBe("4");
	});

	test("percentage calculations", () => {
		// Базовые операции с процентами
		expect(evaluateExpression("100+10%")).toBe("110"); // 100 + (100 * 0.1)
		expect(evaluateExpression("100-10%")).toBe("90"); // 100 - (100 * 0.1)
		expect(evaluateExpression("100*10%")).toBe("10"); // 100 * 0.1
		expect(evaluateExpression("100/10%")).toBe("1000"); // 100 / 0.1
		expect(evaluateExpression("50+50%")).toBe("75"); // 50 + (50 * 0.5)
		expect(evaluateExpression("200-25%")).toBe("150"); // 200 - (200 * 0.25)
		expect(evaluateExpression("50%")).toBe("0.5");
		expect(evaluateExpression("200*5%")).toBe("10");

		// Последовательные операции с процентами
		expect(evaluateExpression("100+10%+10%")).toBe("121");
		expect(evaluateExpression("100-10%-10%")).toBe("81");
		expect(evaluateExpression("50+50%+25%")).toBe("87.5");

		// Смешанные операции
		expect(evaluateExpression("100+50+10%")).toBe("165");
		expect(evaluateExpression("200-50+10%")).toBe("165");
	});

	test("square root", () => {
		expect(evaluateExpression("√16")).toBe("4");
		expect(evaluateExpression("√100")).toBe("10");
	});

	test("complex expressions", () => {
		expect(evaluateExpression("2+2*2")).toBe("6");
		expect(evaluateExpression("(2+2)*2")).toBe("8");
		expect(evaluateExpression("100+50%+25%")).toBe("175");
	});

	test("error cases", () => {
		expect(evaluateExpression("1/0")).toBe("Error");
		expect(evaluateExpression("√-1")).toBe("Error");
		expect(evaluateExpression("abc")).toBe("Error");
	});
});

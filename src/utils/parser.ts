type Token = string | number;

export const evaluateExpression = (expression: string): string => {
	try {
		const tokens = tokenize(expression);
		const preprocessedTokens = preprocessPercentages(tokens);
		const rpn = infixToPostfix(preprocessedTokens);
		const result = evaluatePostfix(rpn);
		return result.toString();
	} catch (error) {
		return "Error";
	}
};

const preprocessPercentages = (tokens: Token[]): Token[] => {
	const processedTokens: Token[] = [];
	let i = 0;
	while (i < tokens.length) {
		if (
			i >= 3 &&
			tokens[i] === "%" &&
			typeof tokens[i - 1] === "number" &&
			(tokens[i - 2] === "+" || tokens[i - 2] === "-") &&
			typeof tokens[i - 3] === "number"
		) {
			const a = tokens[i - 3];
			const op = tokens[i - 2];
			const b = tokens[i - 1];

			processedTokens.splice(processedTokens.length - 3, 3); // удаляем a, op, b
			processedTokens.push(a);
			processedTokens.push(op);
			processedTokens.push("(");
			processedTokens.push(a);
			processedTokens.push("*");
			processedTokens.push(b);
			processedTokens.push("%");
			processedTokens.push(")");

			i += 1; // только текущий % уже обработан
		} else {
			processedTokens.push(tokens[i]);
			i++;
		}
	}
	return processedTokens;
};

const tokenize = (expression: string): Token[] => {
	const regex = /\d+(\.\d+)?|[-+*/%√()]|\s+/g;
	const tokens: Token[] = [];
	let match: RegExpExecArray | null;
	let lastToken: Token | null = null;

	while ((match = regex.exec(expression)) !== null) {
		const token = match[0].trim();
		if (token.length > 0) {
			if (
				token === "-" &&
				(lastToken === null ||
					lastToken === "(" ||
					(typeof lastToken === "string" && /[+\-*/%√]/.test(lastToken)))
			) {
				match = regex.exec(expression);
				if (match) {
					const nextToken = match[0].trim();
					tokens.push(-Number(nextToken));
					lastToken = -Number(nextToken);
				}
			} else {
				tokens.push(isNaN(Number(token)) ? token : Number(token));
				lastToken = tokens[tokens.length - 1];
			}
		}
	}

	return tokens;
};

const precedence = (operator: string): number => {
	switch (operator) {
		case "+":
		case "-":
			return 1;
		case "*":
		case "/":
		case "%":
			return 2;
		case "√":
			return 4;
		default:
			return 0;
	}
};

const infixToPostfix = (tokens: Token[]): Token[] => {
	const outputQueue: Token[] = [];
	const operatorStack: string[] = [];

	tokens.forEach((token) => {
		if (typeof token === "number") {
			outputQueue.push(token);
		} else if (token === "(") {
			operatorStack.push(token);
		} else if (token === ")") {
			while (
				operatorStack.length &&
				operatorStack[operatorStack.length - 1] !== "("
			) {
				outputQueue.push(operatorStack.pop()!);
			}
			operatorStack.pop();
		} else {
			while (
				operatorStack.length &&
				precedence(operatorStack[operatorStack.length - 1]) >= precedence(token)
			) {
				outputQueue.push(operatorStack.pop()!);
			}
			operatorStack.push(token);
		}
	});

	while (operatorStack.length) {
		outputQueue.push(operatorStack.pop()!);
	}

	return outputQueue;
};

const evaluatePostfix = (tokens: Token[]): number => {
	const stack: number[] = [];
	let lastOperator: string | null = null;

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		if (typeof token === "number") {
			stack.push(token);
		} else if (token === "%") {
			const value = stack.pop()!;
			if (lastOperator === "+" || lastOperator === "-") {
				const base = stack[stack.length - 1];
				stack.push((base * value) / 100);
			} else {
				stack.push(value / 100);
			}
		} else {
			if (["+", "-", "*", "/"].includes(token)) {
				lastOperator = token;
			}

			if (token === "√") {
				const a = stack.pop()!;
				if (a < 0) throw new Error("Invalid square root");
				stack.push(Math.sqrt(a));
			} else {
				const b = stack.pop()!;
				if (!stack.length) throw new Error("Invalid expression");
				const a = stack.pop()!;

				switch (token) {
					case "+":
						stack.push(a + b);
						break;
					case "-":
						stack.push(a - b);
						break;
					case "*":
						stack.push(a * b);
						break;
					case "/":
						if (b === 0) throw new Error("Division by zero");
						stack.push(a / b);
						break;
					default:
						throw new Error("Unknown operator");
				}
			}
		}
	}

	if (stack.length !== 1) throw new Error("Invalid expression");
	return stack[0];
};

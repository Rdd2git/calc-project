import React, { useState } from 'react';
import { evaluateExpression } from '../utils/parser';

const MAX_LENGTH = 18;

// Кнопки по строкам, последний элемент каждой строки — операция
const BUTTON_ROWS = [
    ['C', '⌫', '%', '√'],
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['00', '0', ',', '+'],
    ['='],
];

const Calculator: React.FC = () => {
    const [expression, setExpression] = useState<string>('');
    const [result, setResult] = useState<string>('0');
    const [isCalculated, setIsCalculated] = useState<boolean>(false);

    const handleButtonClick = (value: string) => {
        if (!value) return;
        
        if (value === '=') {
            try {
                if (!expression) return;
                
                let expr = expression.replace(/×/g, '*').replace(/÷/g, '/');
                let computedResult = evaluateExpression(expr);

                if (computedResult === 'Error') {
                    setResult('Error');
                    return;
                }

                // Форматируем результат
                let formattedResult = parseFloat(computedResult);
                computedResult = formattedResult.toString();
                
                if (computedResult.length > MAX_LENGTH) {
                    computedResult = formattedResult.toExponential(10);
                }

                setResult(computedResult);
                setExpression(computedResult);
                setIsCalculated(true);
            } catch {
                setResult('Error');
                setIsCalculated(true);
            }
        } else if (value === 'C') {
            setExpression('');
            setResult('0');
            setIsCalculated(false);
        } else if (value === '⌫') {
            if (isCalculated || expression === 'Error') {
                setExpression('');
                setResult('0');
                setIsCalculated(false);
            } else {
                const newExpr = expression.slice(0, -1);
                setExpression(newExpr);
                if (!newExpr) setResult('0');
            }
        } else {
            // Новое поведение: если на экране результат, и пользователь вводит число или точку — начать новое выражение
            if (isCalculated && (/^\d$/.test(value) || value === ',' || value === '00')) {
                setExpression(value === ',' ? '0.' : value);
                setResult('0');
                setIsCalculated(false);
            } else if (isCalculated) {
                // Если вводится оператор после результата — продолжаем выражение
                setExpression(result + (value === ',' ? '.' : value));
                setIsCalculated(false);
            } else {
                if (expression.length < MAX_LENGTH) {
                    const updatedValue = value === ',' ? '.' : value;
                    // Проверка на дублирование операторов
                    const lastChar = expression.slice(-1);
                    if (['+', '-', '×', '÷', '%'].includes(updatedValue) && 
                        ['+', '-', '×', '÷', '%'].includes(lastChar)) {
                        setExpression(prev => prev.slice(0, -1) + updatedValue);
                    } else {
                        setExpression(prev => prev + updatedValue);
                    }
                }
            }
        }
    };

    return (
        <div className="calculator">
            <div className="display">
                <div className="expression">{expression}</div>
                <div className="result">{result}</div>
            </div>
            <div className="button-grid-vertical">
                {BUTTON_ROWS.map((row, rowIdx) => (
                    <div className="button-row" key={rowIdx}>
                        {row.map((btn, colIdx) => (
                            <button
                                key={btn + rowIdx}
                                className={
                                    btn === '='
                                        ? 'button-equal'
                                        : ['+', '-', '×', '÷', '%', '√', 'C', '⌫'].includes(btn)
                                        ? 'button-op'
                                        : ''
                                }
                                onClick={() => handleButtonClick(btn)}
                            >
                                {btn}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calculator;

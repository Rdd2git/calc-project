import React from 'react';

interface ButtonProps {
    value: string;
    onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ value, onClick }) => (
    <button className="calculator-button" onClick={onClick}>
        {value}
    </button>
);

export default Button;

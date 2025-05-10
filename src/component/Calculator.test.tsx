import { render, fireEvent, screen } from '@testing-library/react';
import Calculator from './Calculator';

describe('Calculator Component', () => {
    test('renders calculator', () => {
        render(<Calculator />);
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('number input', () => {
        render(<Calculator />);
        fireEvent.click(screen.getByText('1'));
        fireEvent.click(screen.getByText('2'));
        expect(screen.getByText('12')).toBeInTheDocument();
    });

    test('basic calculation', () => {
        render(<Calculator />);
        fireEvent.click(screen.getByText('2'));
        fireEvent.click(screen.getByText('+'));
        fireEvent.click(screen.getByText('2'));
        fireEvent.click(screen.getByText('='));
        expect(screen.getByText('4')).toBeInTheDocument();
    });

    test('percentage calculation', () => {
        render(<Calculator />);
        fireEvent.click(screen.getByText('1'));
        fireEvent.click(screen.getByText('0'));
        fireEvent.click(screen.getByText('0'));
        fireEvent.click(screen.getByText('+'));
        fireEvent.click(screen.getByText('1'));
        fireEvent.click(screen.getByText('0'));
        fireEvent.click(screen.getByText('%'));
        fireEvent.click(screen.getByText('='));
        expect(screen.getByText('110')).toBeInTheDocument();
    });

    test('clear button', () => {
        render(<Calculator />);
        fireEvent.click(screen.getByText('1'));
        fireEvent.click(screen.getByText('C'));
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('backspace button', () => {
        render(<Calculator />);
        fireEvent.click(screen.getByText('1'));
        fireEvent.click(screen.getByText('2'));
        fireEvent.click(screen.getByText('⌫'));
        expect(screen.getByText('1')).toBeInTheDocument();
    });
});

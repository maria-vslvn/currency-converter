import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { IconButton } from './IconButton';

const TestIcon = () => <svg data-testid="test-icon" />;

describe('IconButton', () => {
    it('renders a button with an accessible name', () => {
        render(<IconButton aria-label="Swap currencies" icon={<TestIcon />} />);
        expect(screen.getByRole('button', { name: 'Swap currencies' })).toBeInTheDocument();
        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();

        render(
            <IconButton aria-label="Swap currencies" icon={<TestIcon />} onClick={handleClick} />,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Swap currencies' }));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    it('has button type by default', () => {
        render(<IconButton aria-label="Swap currencies" icon={<TestIcon />} />);
        expect(screen.getByRole('button', { name: 'Swap currencies' })).toHaveAttribute(
            'type',
            'button',
        );
    });

    it('supports native button props', () => {
        render(<IconButton aria-label="Swap currencies" icon={<TestIcon />} disabled />);
        expect(screen.getByRole('button', { name: 'Swap currencies' })).toBeDisabled();
    });

    it('merges a custom className with theme styles', () => {
        render(
            <IconButton
                aria-label="Swap currencies"
                icon={<TestIcon />}
                className="custom-class"
            />,
        );
        expect(screen.getByRole('button', { name: 'Swap currencies' })).toHaveClass('custom-class');
    });
});

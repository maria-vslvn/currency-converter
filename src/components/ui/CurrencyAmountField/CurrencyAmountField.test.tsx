import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CurrencyProps } from '../../../api/currency/currency.types';
import { CurrencyAmountField } from './CurrencyAmountField';

const currencies = [
    {
        id: 1,
        name: 'US Dollar',
        short_code: 'USD',
        symbol: '$',
    },
    {
        id: 2,
        name: 'Euro',
        short_code: 'EUR',
        symbol: '€',
    },
    {
        id: 3,
        name: 'British Pound',
        short_code: 'GBP',
        symbol: '£',
    },
] as CurrencyProps[];

describe('CurrencyAmountField', () => {
    const onAmountChange = vi.fn();
    const onCurrencyChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders provided amount and selected currency', () => {
        render(
            <CurrencyAmountField
                amount="100"
                currency="USD"
                currencies={currencies}
                onAmountChange={onAmountChange}
                onCurrencyChange={onCurrencyChange}
            />,
        );

        expect(screen.getByRole('textbox')).toHaveValue('100');
        expect(screen.getByRole('combobox')).toHaveValue('USD');
    });

    it('renders currency symbol for selected currency', () => {
        render(
            <CurrencyAmountField
                amount="100"
                currency="EUR"
                currencies={currencies}
                onAmountChange={onAmountChange}
                onCurrencyChange={onCurrencyChange}
            />,
        );

        expect(screen.getByText('€')).toBeInTheDocument();
    });

    it('renders available currencies', () => {
        render(
            <CurrencyAmountField
                amount="100"
                currency="USD"
                currencies={currencies}
                onAmountChange={onAmountChange}
                onCurrencyChange={onCurrencyChange}
            />,
        );

        expect(screen.getByRole('option', { name: 'US Dollar (USD)' })).toBeInTheDocument();

        expect(screen.getByRole('option', { name: 'Euro (EUR)' })).toBeInTheDocument();

        expect(screen.getByRole('option', { name: 'British Pound (GBP)' })).toBeInTheDocument();
    });

    it('calls onAmountChange with entered value', () => {
        render(
            <CurrencyAmountField
                amount=""
                currency="USD"
                currencies={currencies}
                onAmountChange={onAmountChange}
                onCurrencyChange={onCurrencyChange}
            />,
        );

        fireEvent.change(screen.getByRole('textbox'), {
            target: { value: '150' },
        });

        expect(onAmountChange).toHaveBeenCalledOnce();
        expect(onAmountChange).toHaveBeenCalledWith('150');
    });

    it('calls onCurrencyChange when another currency is selected', async () => {
        const user = userEvent.setup();

        render(
            <CurrencyAmountField
                amount="100"
                currency="USD"
                currencies={currencies}
                onAmountChange={onAmountChange}
                onCurrencyChange={onCurrencyChange}
            />,
        );

        await user.selectOptions(screen.getByRole('combobox'), 'EUR');

        expect(onCurrencyChange).toHaveBeenCalledOnce();
        expect(onCurrencyChange).toHaveBeenCalledWith('EUR');
    });
});

import type { ChangeEvent } from 'react';

import type { CurrencyProps } from '../../../api/currency/currency.types';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';
import { currencyAmountFieldTheme as theme } from './CurrencyAmountField.theme';

interface Props {
    amount: string;
    currency: CurrencyProps['code'];
    onAmountChange: (value: string) => void;
    onCurrencyChange: (value: string) => void;
    currencies: CurrencyProps[];
}

export const CurrencyAmountField = ({
    amount,
    currency,
    onAmountChange,
    onCurrencyChange,
    currencies,
}: Props) => {
    const symbol = currencies.find((item) => currency === item.short_code)?.symbol;

    const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        onAmountChange(event.target.value);
    };

    const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
        onCurrencyChange(event.target.value);
    };

    return (
        <div className={theme.base}>
            <label className={theme.amount} htmlFor="amount">
                {symbol && <span className={theme.symbol}>{symbol}</span>}
                <input
                    id="amount"
                    type="text"
                    value={amount}
                    className={theme.input}
                    onChange={handleAmountChange}
                />
            </label>

            <div className={theme.selectWrapper}>
                <select
                    name="baseCurrency"
                    id="baseCurrency"
                    value={currency}
                    className={theme.select}
                    onChange={handleCurrencyChange}
                >
                    {currencies.map((option) => (
                        <option key={option.id} value={option.short_code}>
                            {`${option.name} (${option.short_code})`}
                        </option>
                    ))}
                </select>
                <ChevronDownIcon aria-hidden="true" className={theme.selectIcon} />
            </div>
        </div>
    );
};

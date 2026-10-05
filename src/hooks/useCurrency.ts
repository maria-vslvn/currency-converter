import { useEffect, useState } from 'react';

import { getCurrencies } from '../api/currency/currency.api';
import type { CurrencyProps } from '../api/currency/currency.types';
import {
    BASE_DEFAULT_CURRENCY_CODE,
    INITIAL_AMOUNT,
    TARGET_DEFAULT_CURRENCY_CODE,
} from '../config/common';
import { useConversion } from './useConversion';
import { useDebouncedValue } from './useDebouncedValue';

export const useCurrency = () => {
    const [currencies, setCurrencies] = useState<CurrencyProps[] | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [fromCode, setFromCode] = useState<CurrencyProps['short_code']>(
        BASE_DEFAULT_CURRENCY_CODE,
    );
    const [toCode, setToCode] = useState<CurrencyProps['short_code']>(TARGET_DEFAULT_CURRENCY_CODE);
    const [fromAmount, setFromAmount] = useState<string>(INITIAL_AMOUNT);
    const [toAmount, setToAmount] = useState<string>(INITIAL_AMOUNT);
    const [activeField, setActiveField] = useState<'from' | 'to'>('from');

    const { isLoading, error, convert } = useConversion();

    const fromCurrencyItem = currencies?.find(({ short_code }) => fromCode === short_code);
    const toCurrencyItem = currencies?.find(({ short_code }) => toCode === short_code);

    const isFromActive = activeField === 'from';

    const baseCurrencyCode = isFromActive ? fromCode : toCode;
    const targetCurrencyCode = isFromActive ? toCode : fromCode;
    const debouncedAmount = useDebouncedValue(isFromActive ? fromAmount : toAmount);

    const handleFromAmountChange = (value: string) => {
        setFromAmount(value);
        setActiveField('from');
    };

    const handleToAmountChange = (value: string) => {
        setToAmount(value);
        setActiveField('to');
    };

    const handleSwap = () => {
        setFromCode(toCode);
        setToCode(fromCode);

        setFromAmount(toAmount);
        setToAmount(fromAmount);

        setActiveField((currentField) => (currentField === 'from' ? 'to' : 'from'));
    };

    useEffect(() => {
        const loadCurrencies = async () => {
            setIsFetching(true);
            setFetchError(null);

            try {
                const { response } = await getCurrencies();

                setCurrencies(response);
            } catch {
                setCurrencies(null);
                setFetchError('Currencies load failure');
            } finally {
                setIsFetching(false);
            }
        };

        void loadCurrencies();
    }, []);

    useEffect(() => {
        if (!debouncedAmount || Number(debouncedAmount) <= 0) {
            return;
        }

        const handleConvert = async () => {
            const conversionResult = await convert({
                from: baseCurrencyCode,
                to: targetCurrencyCode,
                amount: debouncedAmount,
            });

            if (!conversionResult) {
                return;
            }

            if (isFromActive) {
                setToAmount(String(conversionResult.value));
            } else {
                setFromAmount(String(conversionResult.value));
            }
        };

        void handleConvert();
    }, [debouncedAmount, baseCurrencyCode, targetCurrencyCode, isFromActive, convert]);

    return {
        currencies,
        isLoading,
        error,
        isFetching,
        fetchError,
        from: {
            symbol: fromCurrencyItem?.symbol,
            code: fromCode,
            amount: fromAmount,
            name: fromCurrencyItem?.name,
        },
        to: {
            symbol: toCurrencyItem?.symbol,
            code: toCode,
            amount: toAmount,
            name: toCurrencyItem?.name,
        },
        handleSwap,
        setFromCode,
        setToCode,
        handleFromAmountChange,
        handleToAmountChange,
    };
};

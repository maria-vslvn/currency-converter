import { apiCurrencyClient } from './currency.client';
import type {
    CurenciesResponseT,
    CurrencyConversionPayloadProps,
    CurrencyConversionResponseT,
} from './currency.types';

export const getCurrencies = () => apiCurrencyClient<CurenciesResponseT>('currencies');

export const getConversion = ({ from, to, amount }: CurrencyConversionPayloadProps) => {
    const params = new URLSearchParams({ from, to, amount });

    return apiCurrencyClient<CurrencyConversionResponseT>(`convert?${params.toString()}`);
};

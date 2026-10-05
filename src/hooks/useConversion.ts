import { useCallback, useState } from 'react';

import { getConversion } from '../api/currency/currency.api';
import type { CurrencyConversionPayloadProps } from '../api/currency/currency.types';

export const useConversion = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const convert = useCallback(async (payload: CurrencyConversionPayloadProps) => {
        setIsLoading(true);
        setError(null);

        try {
            const { response } = await getConversion(payload);

            return response;
        } catch {
            setError('Currency conversion failed');

            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        convert,
    };
};

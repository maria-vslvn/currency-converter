import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCurrencies } from '../api/currency/currency.api';
import type { CurrencyProps } from '../api/currency/currency.types';
import {
    BASE_DEFAULT_CURRENCY_CODE,
    INITIAL_AMOUNT,
    TARGET_DEFAULT_CURRENCY_CODE,
} from '../config/common';
import { useConversion } from './useConversion';
import { useCurrency } from './useCurrency';
import { useDebouncedValue } from './useDebouncedValue';

vi.mock('../api/currency/currency.api', () => ({
    getCurrencies: vi.fn(),
}));

vi.mock('./useConversion', () => ({
    useConversion: vi.fn(),
}));

vi.mock('./useDebouncedValue', () => ({
    useDebouncedValue: vi.fn(),
}));

const mockedGetCurrencies = vi.mocked(getCurrencies);
const mockedUseConversion = vi.mocked(useConversion);
const mockedUseDebouncedValue = vi.mocked(useDebouncedValue);
const convert = vi.fn();
const currencies = [
    {
        id: 1,
        name: 'Base currency',
        short_code: BASE_DEFAULT_CURRENCY_CODE,
        symbol: '$',
    },
    {
        id: 2,
        name: 'Target currency',
        short_code: TARGET_DEFAULT_CURRENCY_CODE,
        symbol: '€',
    },
    {
        id: 3,
        name: 'British Pound',
        short_code: 'GBP',
        symbol: '£',
    },
] as CurrencyProps[];

describe('useCurrency', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseDebouncedValue.mockImplementation((value) => value);
        mockedUseConversion.mockReturnValue({
            isLoading: false,
            error: null,
            convert,
        });
        convert.mockResolvedValue(null);
        mockedGetCurrencies.mockResolvedValue({ response: currencies });
    });

    it('loads currencies on mount', async () => {
        const { result } = renderHook(() => useCurrency());

        await waitFor(() => {
            expect(result.current.currencies).toEqual(currencies);
        });

        expect(mockedGetCurrencies).toHaveBeenCalledOnce();
        expect(result.current.isFetching).toBe(false);
        expect(result.current.fetchError).toBeNull();
    });

    it('uses default currency codes and amounts initially', () => {
        const { result } = renderHook(() => useCurrency());

        expect(result.current.from.code).toBe(BASE_DEFAULT_CURRENCY_CODE);
        expect(result.current.to.code).toBe(TARGET_DEFAULT_CURRENCY_CODE);
        expect(result.current.from.amount).toBe(INITIAL_AMOUNT);
        expect(result.current.to.amount).toBe(INITIAL_AMOUNT);
    });

    it('provides metadata for selected currencies', async () => {
        const { result } = renderHook(() => useCurrency());

        await waitFor(() => {
            expect(result.current.currencies).toEqual(currencies);
        });

        expect(result.current.from.name).toBe('Base currency');
        expect(result.current.from.symbol).toBe('$');
        expect(result.current.to.name).toBe('Target currency');
        expect(result.current.to.symbol).toBe('€');
    });

    it('performs initial conversion', async () => {
        renderHook(() => useCurrency());

        await waitFor(() => {
            expect(convert).toHaveBeenCalledWith({
                from: BASE_DEFAULT_CURRENCY_CODE,
                to: TARGET_DEFAULT_CURRENCY_CODE,
                amount: INITIAL_AMOUNT,
            });
        });
    });

    it('converts from base currency to target currency when from amount changes', async () => {
        const { result } = renderHook(() => useCurrency());

        await waitFor(() => {
            expect(convert).toHaveBeenCalled();
        });

        convert.mockClear();
        convert.mockResolvedValueOnce({
            value: 92.5,
        });
        act(() => {
            result.current.handleFromAmountChange('100');
        });

        await waitFor(() => {
            expect(convert).toHaveBeenCalledWith({
                from: BASE_DEFAULT_CURRENCY_CODE,
                to: TARGET_DEFAULT_CURRENCY_CODE,
                amount: '100',
            });
        });

        await waitFor(() => {
            expect(result.current.to.amount).toBe('92.5');
        });
    });

    it('reverses conversion direction when to amount changes', async () => {
        const { result } = renderHook(() => useCurrency());

        await waitFor(() => {
            expect(convert).toHaveBeenCalled();
        });

        convert.mockClear();
        convert.mockResolvedValueOnce({
            value: 108.25,
        });
        act(() => {
            result.current.handleToAmountChange('100');
        });

        await waitFor(() => {
            expect(convert).toHaveBeenCalledWith({
                from: TARGET_DEFAULT_CURRENCY_CODE,
                to: BASE_DEFAULT_CURRENCY_CODE,
                amount: '100',
            });
        });

        await waitFor(() => {
            expect(result.current.from.amount).toBe('108.25');
        });
    });

    it('recalculates conversion when from currency changes', async () => {
        const { result } = renderHook(() => useCurrency());

        await waitFor(() => {
            expect(convert).toHaveBeenCalled();
        });

        convert.mockClear();
        act(() => {
            result.current.setFromCode('GBP');
        });

        await waitFor(() => {
            expect(convert).toHaveBeenCalledWith({
                from: 'GBP',
                to: TARGET_DEFAULT_CURRENCY_CODE,
                amount: INITIAL_AMOUNT,
            });
        });

        await waitFor(() => {
            expect(result.current.from.code).toBe('GBP');
            expect(result.current.from.name).toBe('British Pound');
            expect(result.current.from.symbol).toBe('£');
        });
    });

    it('recalculates conversion when to currency changes', async () => {
        const { result } = renderHook(() => useCurrency());

        await waitFor(() => {
            expect(convert).toHaveBeenCalled();
        });

        convert.mockClear();
        act(() => {
            result.current.setToCode('GBP');
        });

        await waitFor(() => {
            expect(convert).toHaveBeenCalledWith({
                from: BASE_DEFAULT_CURRENCY_CODE,
                to: 'GBP',
                amount: INITIAL_AMOUNT,
            });
        });

        await waitFor(() => {
            expect(result.current.to.code).toBe('GBP');
            expect(result.current.to.name).toBe('British Pound');
            expect(result.current.to.symbol).toBe('£');
        });
    });

    it('does not convert empty or non-positive amount', async () => {
        const { result } = renderHook(() => useCurrency());

        await waitFor(() => {
            expect(convert).toHaveBeenCalled();
        });

        convert.mockClear();
        act(() => {
            result.current.handleFromAmountChange('');
        });
        expect(convert).not.toHaveBeenCalled();
        act(() => {
            result.current.handleFromAmountChange('0');
        });
        expect(convert).not.toHaveBeenCalled();
        act(() => {
            result.current.handleFromAmountChange('-10');
        });
        expect(convert).not.toHaveBeenCalled();
    });

    it('does not update converted amount when conversion fails', async () => {
        const { result } = renderHook(() => useCurrency());

        await waitFor(() => {
            expect(convert).toHaveBeenCalled();
        });

        convert.mockClear();
        convert.mockResolvedValueOnce(null);
        act(() => {
            result.current.handleFromAmountChange('100');
        });

        await waitFor(() => {
            expect(convert).toHaveBeenCalledWith({
                from: BASE_DEFAULT_CURRENCY_CODE,
                to: TARGET_DEFAULT_CURRENCY_CODE,
                amount: '100',
            });
        });

        expect(result.current.to.amount).toBe(INITIAL_AMOUNT);
    });

    it('sets fetch error when currencies request fails', async () => {
        mockedGetCurrencies.mockRejectedValueOnce(new Error('Request failed'));

        const { result } = renderHook(() => useCurrency());

        await waitFor(() => {
            expect(result.current.fetchError).toBe('Currencies load failure');
        });

        expect(result.current.currencies).toBeNull();
        expect(result.current.isFetching).toBe(false);
    });

    it('sets fetching state while currencies are loading', async () => {
        let resolveRequest:
            ((value: Awaited<ReturnType<typeof getCurrencies>>) => void) | undefined;

        mockedGetCurrencies.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveRequest = resolve;
                }),
        );

        const { result } = renderHook(() => useCurrency());

        expect(result.current.isFetching).toBe(true);

        act(() => {
            resolveRequest?.({
                response: currencies,
            });
        });

        await waitFor(() => {
            expect(result.current.isFetching).toBe(false);
        });

        expect(result.current.currencies).toEqual(currencies);
    });

    it('exposes conversion loading and error state', () => {
        mockedUseConversion.mockReturnValue({
            isLoading: true,
            error: 'Currency conversion failed',
            convert,
        });

        const { result } = renderHook(() => useCurrency());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.error).toBe('Currency conversion failed');
    });
});

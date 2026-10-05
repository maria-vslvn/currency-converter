import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getConversion } from '../api/currency/currency.api';
import type { CurrencyConversionPayloadProps } from '../api/currency/currency.types';
import { useConversion } from './useConversion';

vi.mock('../api/currency/currency.api', () => ({
    getConversion: vi.fn(),
}));

const mockedGetConversion = vi.mocked(getConversion);
const payload: CurrencyConversionPayloadProps = {
    from: 'USD',
    to: 'EUR',
    amount: '100',
};

describe('useConversion', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns initial state', () => {
        const { result } = renderHook(() => useConversion());

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('returns conversion response on successful request', async () => {
        const apiResult = {
            response: {
                value: 92.5,
            },
        } as Awaited<ReturnType<typeof getConversion>>;

        mockedGetConversion.mockResolvedValue(apiResult);

        const { result } = renderHook(() => useConversion());
        let response;

        await act(async () => {
            response = await result.current.convert(payload);
        });

        expect(mockedGetConversion).toHaveBeenCalledOnce();
        expect(mockedGetConversion).toHaveBeenCalledWith(payload);
        expect(response).toEqual(apiResult.response);
        expect(result.current.error).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it('sets error and returns null when conversion fails', async () => {
        mockedGetConversion.mockRejectedValue(new Error('Request failed'));

        const { result } = renderHook(() => useConversion());

        let response;

        await act(async () => {
            response = await result.current.convert(payload);
        });

        expect(response).toBeNull();
        expect(result.current.error).toBe('Currency conversion failed');
        expect(result.current.isLoading).toBe(false);
    });

    it('sets loading state while conversion is in progress', async () => {
        let resolveRequest:
            ((value: Awaited<ReturnType<typeof getConversion>>) => void) | undefined;

        mockedGetConversion.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveRequest = resolve;
                }),
        );

        const { result } = renderHook(() => useConversion());
        let conversionPromise: ReturnType<typeof result.current.convert>;

        act(() => {
            conversionPromise = result.current.convert(payload);
        });
        expect(result.current.isLoading).toBe(true);

        const apiResult = {
            response: {
                value: 92.5,
            },
        } as Awaited<ReturnType<typeof getConversion>>;

        await act(async () => {
            resolveRequest?.(apiResult);
            await conversionPromise;
        });

        expect(result.current.isLoading).toBe(false);
    });

    it('clears previous error when a new conversion starts', async () => {
        mockedGetConversion.mockRejectedValueOnce(new Error('Request failed'));

        const { result } = renderHook(() => useConversion());

        await act(async () => {
            await result.current.convert(payload);
        });

        expect(result.current.error).toBe('Currency conversion failed');

        const apiResult = {
            response: {
                value: 92.5,
            },
        } as Awaited<ReturnType<typeof getConversion>>;

        mockedGetConversion.mockResolvedValueOnce(apiResult);

        await act(async () => {
            await result.current.convert(payload);
        });

        expect(result.current.error).toBeNull();
    });
});

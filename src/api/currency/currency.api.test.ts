import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getConversion, getCurrencies } from './currency.api';
import { apiCurrencyClient } from './currency.client';

vi.mock('./currency.client', () => ({
    apiCurrencyClient: vi.fn(),
}));

const mockedApiCurrencyClient = vi.mocked(apiCurrencyClient);

describe('currency api', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getCurrencies', () => {
        it('requests currencies endpoint', async () => {
            await getCurrencies();

            expect(mockedApiCurrencyClient).toHaveBeenCalledOnce();
            expect(mockedApiCurrencyClient).toHaveBeenCalledWith('currencies');
        });
    });

    describe('getConversion', () => {
        it('requests conversion endpoint with provided parameters', async () => {
            await getConversion({
                from: 'USD',
                to: 'EUR',
                amount: '100',
            });

            expect(mockedApiCurrencyClient).toHaveBeenCalledOnce();

            expect(mockedApiCurrencyClient).toHaveBeenCalledWith(
                'convert?from=USD&to=EUR&amount=100',
            );
        });

        it('encodes conversion parameters in query string', async () => {
            await getConversion({
                from: 'USD',
                to: 'PLN',
                amount: '123.45',
            });

            expect(mockedApiCurrencyClient).toHaveBeenCalledWith(
                'convert?from=USD&to=PLN&amount=123.45',
            );
        });
    });
});

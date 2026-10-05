import { BASE_URL } from './currency.config';

export const apiCurrencyClient = async <T>(path: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}/${path}`);

    if (!response.ok) {
        throw new Error(`Request failed with status ${String(response.status)}`);
    }

    return response.json() as Promise<T>;
};

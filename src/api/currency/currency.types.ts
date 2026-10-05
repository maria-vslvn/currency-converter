export interface CurenciesResponseT {
    response: CurrencyProps[];
}

export interface CurrencyProps {
    id: number;
    name: string;
    short_code: string;
    symbol: string;
    code: string;
    decimal_mark: string;
    precision: number;
    subunit: number;
    symbol_first: boolean;
    thousands_separator: string;
}

export interface CurrencyConversionProps {
    timestamp: number;
    date: string;
    from: string;
    to: string;
    amount: string;
    value: number;
}

export interface CurrencyConversionPayloadProps {
    from: CurrencyProps['code'];
    to: CurrencyProps['code'];
    amount: string;
    date?: string;
}

export type CurrencyConversionResponseT = CurrencyConversionProps & {
    meta: {
        code: number;
        disclaimer: string;
    };
    response: CurrencyConversionProps;
};

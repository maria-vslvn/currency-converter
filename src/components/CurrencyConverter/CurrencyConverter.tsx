import { useCurrency } from '../../hooks/useCurrency';
import { SwapIcon } from '../icons/SwapIcon';
import { Card } from '../ui/Card/Card';
import { CurrencyAmountField } from '../ui/CurrencyAmountField/CurrencyAmountField';
import { IconButton } from '../ui/IconButton/IconButton';

export const CurrencyConverter = () => {
    const {
        currencies,
        error,
        isFetching,
        fetchError,
        from,
        to,
        handleSwap,
        setFromCode,
        setToCode,
        handleFromAmountChange,
        handleToAmountChange,
    } = useCurrency();

    if (!currencies) {
        return null;
    }

    if (isFetching) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex w-full flex-col gap-8">
            {fetchError && <p className="text-red">{fetchError}</p>}
            <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl">Currency Converter</h1>
                <span className="text-lg">
                    {from.symbol} {from.amount} {from.name}' is equal to '{to.symbol} {to.amount}{' '}
                    {to.name}
                </span>
            </div>
            <div className="mw-100 flex items-center justify-around gap-4">
                <Card>
                    <CurrencyAmountField
                        amount={from.amount}
                        currency={from.code}
                        onCurrencyChange={setFromCode}
                        onAmountChange={handleFromAmountChange}
                        currencies={currencies}
                    />
                </Card>
                <IconButton
                    aria-label="Swap currencies"
                    title="Swap currencies"
                    icon={<SwapIcon />}
                    onClick={handleSwap}
                />
                <Card>
                    <CurrencyAmountField
                        amount={to.amount}
                        currency={to.code}
                        onCurrencyChange={setToCode}
                        onAmountChange={handleToAmountChange}
                        currencies={currencies}
                    />
                </Card>
            </div>
            {error && <p className="text-red">{error}</p>}
        </div>
    );
};


import React, { useState, useCallback } from 'react';
import { CurrencySelector } from './CurrencySelector';
import type { Currency } from '../types';
import { CURRENCIES } from '../constants';
import { getExchangeRate } from '../services/geminiService';
import { Icon } from './icons/Icon';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            active ? 'bg-brand-navy text-white' : 'text-brand-gray-dark hover:bg-gray-200'
        }`}
    >
        {children}
    </button>
);

interface ConverterCardProps {
    fromCurrency: Currency;
    toCurrency: Currency;
    setFromCurrency: (currency: Currency) => void;
    setToCurrency: (currency: Currency) => void;
}


export const ConverterCard: React.FC<ConverterCardProps> = ({ fromCurrency, toCurrency, setFromCurrency, setToCurrency }) => {
    const [amount, setAmount] = useState<string>("400000.00");
    const [isLoading, setIsLoading] = useState(false);
    const [conversionResult, setConversionResult] = useState<{ rate: number; convertedAmount: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleSwapCurrencies = () => {
        const temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);
        setConversionResult(null);
    };

    const handleConvert = useCallback(async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setConversionResult(null);

        const rate = await getExchangeRate(fromCurrency.code, toCurrency.code);
        
        if (rate !== null) {
            const numericAmount = parseFloat(amount);
            setConversionResult({
                rate,
                convertedAmount: numericAmount * rate
            });
        } else {
            setError("Could not retrieve exchange rate. Please try again.");
        }
        
        setIsLoading(false);
    }, [amount, fromCurrency.code, toCurrency.code]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full mx-auto -mt-20 relative z-10">
            {/* Tabs */}
            <div className="flex space-x-2 border-b border-brand-gray-medium pb-4 mb-6">
                <TabButton active={true} onClick={() => {}}>
                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></Icon>
                    <span>Convert</span>
                </TabButton>
                <TabButton active={false} onClick={() => {}}>
                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></Icon>
                    <span>Send</span>
                </TabButton>
                <TabButton active={false} onClick={() => {}}>
                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></Icon>
                    <span>Charts</span>
                </TabButton>
                <TabButton active={false} onClick={() => {}}>
                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></Icon>
                    <span>Alerts</span>
                </TabButton>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-10 gap-4 items-end">
                <div className="md:col-span-2">
                    <label className="text-sm text-brand-gray-dark mb-1 block">Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-gray-400">{fromCurrency.symbol}</span>
                        <input
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            className="w-full bg-brand-gray-light border border-brand-gray-medium rounded-md p-3 pl-8 text-2xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                    </div>
                </div>
                <div className="md:col-span-3">
                    <CurrencySelector label="From" selectedCurrency={fromCurrency} onSelectCurrency={setFromCurrency} currencies={CURRENCIES} />
                </div>
                <div className="md:col-span-1 flex justify-center">
                    <button onClick={handleSwapCurrencies} className="bg-white border border-brand-gray-medium rounded-full p-3 hover:bg-brand-gray-light hover:border-brand-blue transition-colors">
                       <Icon className="w-5 h-5 text-brand-blue"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></Icon>
                    </button>
                </div>
                <div className="md:col-span-4">
                    <CurrencySelector label="To" selectedCurrency={toCurrency} onSelectCurrency={setToCurrency} currencies={CURRENCIES} />
                </div>
            </div>

            {/* Results and Action */}
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
                <div className="flex-1 text-left mb-4 md:mb-0">
                    {isLoading && <div className="text-brand-gray-dark">Fetching exchange rate...</div>}
                    {error && <div className="text-red-500">{error}</div>}
                    {conversionResult && !isLoading && (
                        <div>
                            <p className="text-2xl font-bold text-gray-800">
                                {parseFloat(amount).toLocaleString('en-US', { maximumFractionDigits: amount.split('.')[1]?.length || 0 })} {fromCurrency.name} =
                            </p>
                            <p className="text-4xl font-bold text-brand-blue">
                                {conversionResult.convertedAmount.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })} {toCurrency.name}
                            </p>
                            <p className="text-sm text-brand-gray-dark mt-1">
                                1 {fromCurrency.code} = {conversionResult.rate.toFixed(4)} {toCurrency.code}
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                    <button 
                        onClick={handleConvert}
                        disabled={isLoading}
                        className="w-full bg-brand-blue text-white font-bold py-4 px-8 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Converting...' : 'Convert'}
                    </button>
                </div>
            </div>
        </div>
    );
};

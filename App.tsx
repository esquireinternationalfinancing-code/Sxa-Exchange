import React, { useState } from 'react';
import { Header } from './components/Header';
import { ConverterCard } from './components/ConverterCard';
import { HistoricalChart } from './components/HistoricalChart';
import { Icon } from './components/icons/Icon';
import { CURRENCIES } from './constants';
import type { Currency } from './types';


function App() {
  const [fromCurrency, setFromCurrency] = useState<Currency>(CURRENCIES.find(c => c.code === 'JPY')!);
  const [toCurrency, setToCurrency] = useState<Currency>(CURRENCIES.find(c => c.code === 'USD')!);

  return (
    <div className="min-h-screen bg-brand-gray-light font-sans">
      <div className="bg-brand-navy">
        <Header />
        <main className="container mx-auto px-4 pt-12 pb-24 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold">Sxa Currency Converter</h1>
          <p className="mt-2 text-lg text-gray-300">Check live foreign currency exchange rates</p>
        </main>
      </div>

      <div className="container mx-auto px-4">
        <ConverterCard 
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            setFromCurrency={setFromCurrency}
            setToCurrency={setToCurrency}
        />
      </div>
      
      <div className="container mx-auto px-4 mt-8">
        <HistoricalChart fromCurrency={fromCurrency} toCurrency={toCurrency} />
      </div>

      <div className="container mx-auto px-4 my-8 text-center">
        <div className="max-w-4xl mx-auto flex items-center justify-center text-brand-gray-dark text-xs">
          <Icon className="w-4 h-4 mr-2 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
          <span>
            We use the mid-market rate for our Converter. This is for informational purposes only. You won't receive this rate when sending money.
          </span>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-16 pb-16 text-center">
        <h2 className="text-4xl font-bold text-gray-800">Live exchange rates</h2>
        <p className="mt-2 text-lg text-brand-gray-dark">Compare 100+ currencies in real time & find the right moment to transfer funds</p>
      </div>

    </div>
  );
}

export default App;
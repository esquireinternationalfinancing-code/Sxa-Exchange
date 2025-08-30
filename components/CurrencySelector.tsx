import React, { useState, useRef, useEffect } from 'react';
import type { Currency } from '../types';
import { Icon } from './icons/Icon';

interface CurrencySelectorProps {
  label: string;
  selectedCurrency: Currency;
  onSelectCurrency: (currency: Currency) => void;
  currencies: Currency[];
}

const Flag: React.FC<{ countryCode: string }> = ({ countryCode }) => (
  <img
    src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
    width="20"
    alt={`${countryCode} flag`}
    className="rounded-full"
  />
);

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ label, selectedCurrency, onSelectCurrency, currencies }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Auto-focus the search input when the dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 relative" ref={dropdownRef}>
      <label className="text-sm text-brand-gray-dark mb-1 block">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-brand-gray-medium rounded-md p-3 flex items-center justify-between text-left hover:border-brand-blue transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Flag countryCode={selectedCurrency.countryCode} />
          <span className="font-semibold text-gray-800">{selectedCurrency.code} - {selectedCurrency.name}</span>
        </div>
        <Icon className="w-5 h-5 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </Icon>
      </button>

      {isOpen && (
        <div className="absolute z-10 top-full mt-1 w-full max-h-60 overflow-y-auto bg-white border border-brand-gray-medium rounded-md shadow-lg">
          <div className="p-2">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search currency"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
          <ul>
            {filteredCurrencies.map(currency => (
              <li
                key={currency.code}
                onClick={() => {
                  onSelectCurrency(currency);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className="px-4 py-3 hover:bg-brand-gray-light cursor-pointer flex items-center space-x-3"
              >
                <Flag countryCode={currency.countryCode} />
                <span>{currency.code} - {currency.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
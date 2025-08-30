import React from 'react';
import { Icon } from './icons/Icon';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-navy p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-3xl font-bold tracking-tighter">
          Sxa
        </div>
        <button className="text-white">
          <Icon className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </Icon>
        </button>
      </div>
    </header>
  );
};
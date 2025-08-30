
import React, { useState, useEffect, useMemo } from 'react';
import type { Currency, HistoricalDataPoint } from '../types';
import { getHistoricalRates } from '../services/geminiService';

interface ChartProps {
  fromCurrency: Currency;
  toCurrency: Currency;
}

const timeframes = [
  { label: '1D', value: '1 day' },
  { label: '7D', value: '7 days' },
  { label: '1M', value: '1 month' },
  { label: '1Y', value: '1 year' },
];

const ChartSVG: React.FC<{ data: HistoricalDataPoint[] }> = ({ data }) => {
    const width = 600;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const { minRate, maxRate, pathData, gridLines, yAxisLabels, xAxisLabels } = useMemo(() => {
        if (!data || data.length < 2) return { minRate: 0, maxRate: 0, pathData: '', gridLines: [], yAxisLabels: [], xAxisLabels: [] };

        const rates = data.map(d => d.rate);
        const minRate = Math.min(...rates);
        const maxRate = Math.max(...rates);
        const rateRange = maxRate - minRate;

        const yScale = (rate: number) => {
            if (rateRange === 0) return innerHeight / 2;
            return innerHeight - ((rate - minRate) / rateRange) * innerHeight;
        };
        const xScale = (index: number) => (index / (data.length - 1)) * innerWidth;
        
        const pathData = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.rate)}`).join(' ');

        const gridLines = Array.from({ length: 5 }).map((_, i) => {
            const y = (i / 4) * innerHeight;
            return { y1: y, y2: y };
        });

        const yAxisLabels = Array.from({ length: 5 }).map((_, i) => {
            const rate = maxRate - (i / 4) * rateRange;
            return {
                y: (i / 4) * innerHeight,
                label: rate.toFixed(4)
            };
        });
        
        const firstDate = new Date(data[0].date);
        const lastDate = new Date(data[data.length - 1].date);
        
        const xAxisLabels = [
            { x: xScale(0), label: firstDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) },
            { x: xScale(data.length - 1), label: lastDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }
        ];

        return { minRate, maxRate, pathData, gridLines, yAxisLabels, xAxisLabels };
    }, [data, innerHeight, innerWidth]);


    return (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" aria-labelledby="chart-title" role="img">
            <title id="chart-title">Historical exchange rate chart</title>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* Grid Lines */}
                {gridLines.map((line, i) => (
                    <line key={i} x1={0} x2={innerWidth} y1={line.y1} y2={line.y2} stroke="#e3e8ee" strokeWidth="1" />
                ))}

                {/* Y-Axis Labels */}
                {yAxisLabels.map((axis, i) => (
                     <text key={i} x={-10} y={axis.y} textAnchor="end" alignmentBaseline="middle" fill="#6e7d90" fontSize="12">
                        {axis.label}
                     </text>
                ))}
                
                {/* X-Axis Labels */}
                {xAxisLabels.map((axis, i) => (
                    <text key={i} x={axis.x} y={innerHeight + 20} textAnchor={i === 0 ? "start" : "end"} fill="#6e7d90" fontSize="12">
                        {axis.label}
                    </text>
                ))}

                {/* Line Path */}
                <path d={pathData} fill="none" stroke="#0057b8" strokeWidth="2" />
            </g>
        </svg>
    );
};


export const HistoricalChart: React.FC<ChartProps> = ({ fromCurrency, toCurrency }) => {
  const [activeTimeframe, setActiveTimeframe] = useState(timeframes[2]); // Default to 1M
  const [chartData, setChartData] = useState<HistoricalDataPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      setError(null);
      setChartData(null);

      const data = await getHistoricalRates(fromCurrency.code, toCurrency.code, activeTimeframe.value);
      if (data) {
        setChartData(data);
      } else {
        setError('Could not fetch historical data. Please try another timeframe.');
      }
      setIsLoading(false);
    };

    fetchChartData();
  }, [fromCurrency, toCurrency, activeTimeframe]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
          Historical Rates for {fromCurrency.code}/{toCurrency.code}
        </h3>
        <div className="flex space-x-1 bg-brand-gray-light p-1 rounded-full">
          {timeframes.map((tf) => (
            <button
              key={tf.label}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                activeTimeframe.label === tf.label
                  ? 'bg-white text-brand-navy shadow'
                  : 'text-brand-gray-dark hover:bg-gray-200'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[250px] flex items-center justify-center">
        {isLoading && <div className="text-brand-gray-dark">Loading chart data...</div>}
        {error && !isLoading && <div className="text-red-500">{error}</div>}
        {chartData && !isLoading && <ChartSVG data={chartData} />}
      </div>
    </div>
  );
};

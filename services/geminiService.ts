
import { GoogleGenAI, Type } from "@google/genai";
import type { HistoricalDataPoint } from '../types';

// Ensure API_KEY is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

export const getExchangeRate = async (from: string, to: string): Promise<number | null> => {
    try {
        const prompt = `What is the current exchange rate from ${from} to ${to}?`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        rate: {
                            type: Type.NUMBER,
                            description: `The exchange rate from ${from} to ${to}. Provide only the numerical value.`
                        }
                    },
                    required: ["rate"]
                }
            }
        });

        const jsonString = response.text;
        const parsedResponse = JSON.parse(jsonString);
        
        if (parsedResponse && typeof parsedResponse.rate === 'number') {
            return parsedResponse.rate;
        }
        
        console.error("Failed to parse rate from Gemini response:", jsonString);
        return null;
    } catch (error) {
        console.error("Error fetching exchange rate from Gemini API:", error);
        return null;
    }
};


export const getHistoricalRates = async (from: string, to: string, timeframe: string): Promise<HistoricalDataPoint[] | null> => {
    try {
        const prompt = `Provide daily historical exchange rates from ${from} to ${to} for the past ${timeframe}. Give me a data point for each day.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        rates: {
                            type: Type.ARRAY,
                            description: `An array of historical exchange rates from ${from} to ${to}.`,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    date: {
                                        type: Type.STRING,
                                        description: "The date of the exchange rate in YYYY-MM-DD format."
                                    },
                                    rate: {
                                        type: Type.NUMBER,
                                        description: "The exchange rate for that day."
                                    }
                                },
                                required: ["date", "rate"]
                            }
                        }
                    },
                    required: ["rates"]
                }
            }
        });

        const jsonString = response.text;
        const parsedResponse = JSON.parse(jsonString);

        if (parsedResponse && Array.isArray(parsedResponse.rates) && parsedResponse.rates.length > 0) {
            // Sort by date to ensure the chart is correct
            return parsedResponse.rates.sort((a: HistoricalDataPoint, b: HistoricalDataPoint) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }

        console.error("Failed to parse historical rates from Gemini response:", jsonString);
        return null;
    } catch (error) {
        console.error("Error fetching historical rates from Gemini API:", error);
        return null;
    }
};

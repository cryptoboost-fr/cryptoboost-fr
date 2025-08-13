import { } from './supabase';

const COINAPI_BASE_URL = 'https://rest.coinapi.io/v1';
const COINAPI_KEY = import.meta.env.VITE_COINAPI_KEY;

export interface CoinApiRate {
  asset_id_base: string;
  asset_id_quote: string;
  rate: number;
  time: string;
}

export interface CryptoPrice {
  symbol: string;
  price: number; // quoted in target currency (EUR)
  change24h: number; // optional, set 0 for now
  volume24h: number; // optional, set 0 for now
}

const cache: Record<string, { data: any; ts: number }> = {};
const TTL_MS = 60 * 1000; // 60s cache

async function fetchJson(path: string): Promise<any> {
  if (!COINAPI_KEY) {
    throw new Error('CoinAPI key not configured. Please set VITE_COINAPI_KEY environment variable.');
  }

  const url = `${COINAPI_BASE_URL}${path}`;
  const cacheKey = url;
  const now = Date.now();
  const cached = cache[cacheKey];
  if (cached && (now - cached.ts) < TTL_MS) {
    return cached.data;
  }

  const res = await fetch(url, {
    headers: {
      'X-CoinAPI-Key': COINAPI_KEY,
      'Accept': 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CoinAPI error ${res.status}: ${text}`);
  }
  const data = await res.json();
  cache[cacheKey] = { data, ts: now };
  return data;
}

export async function getExchangeRate(base: string, quote: string): Promise<CoinApiRate> {
  const data = await fetchJson(`/exchangerate/${encodeURIComponent(base)}/${encodeURIComponent(quote)}`);
  return data as CoinApiRate;
}

export async function getPricesForSymbols(symbols: string[], quote: string = 'EUR'): Promise<CryptoPrice[]> {
  const rates = await Promise.all(symbols.map(sym => getExchangeRate(sym, quote).catch(() => null)));
  const prices: CryptoPrice[] = [];
  for (let i = 0; i < symbols.length; i++) {
    const rate = rates[i] as CoinApiRate | null;
    if (rate && typeof rate.rate === 'number') {
      prices.push({ symbol: symbols[i], price: rate.rate, change24h: 0, volume24h: 0 });
    }
  }
  return prices;
}

export async function getPairRate(base: string, quote: string): Promise<number> {
  if (base === quote) return 1;
  // Use direct pair if available
  try {
    const direct = await getExchangeRate(base, quote);
    return direct.rate;
  } catch {
    // Fallback via EUR triangulation
    const [b, q] = await Promise.all([
      getExchangeRate(base, 'EUR'),
      getExchangeRate(quote, 'EUR'),
    ]);
    if (b && q && q.rate !== 0) {
      return b.rate / q.rate;
    }
    throw new Error('Unable to compute pair rate');
  }
}
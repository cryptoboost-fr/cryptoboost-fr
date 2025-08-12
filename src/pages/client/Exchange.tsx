import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth';
import { utils, supabase, transactionApi } from '@/lib/supabase';
import { useToast } from '@/components/ui/toaster';
import { getPricesForSymbols, getPairRate } from '@/lib/coinapi';

interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
}

export const Exchange = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [fromCrypto, setFromCrypto] = useState('BTC');
  const [toCrypto, setToCrypto] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [estimatedAmount, setEstimatedAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<CryptoPrice[]>([]);

  const symbols = ['BTC', 'ETH', 'USDT', 'USDC', 'LTC'];

  // Load live EUR prices via CoinAPI
  useEffect(() => {
    const loadPrices = async () => {
      try {
        const res = await getPricesForSymbols(symbols, 'EUR');
        setPrices(res);
      } catch (err) {
        console.error('CoinAPI prices error', err);
      }
    };
    loadPrices();
    const id = setInterval(loadPrices, 60000);
    return () => clearInterval(id);
  }, []);

  // Calculate exchange rate using CoinAPI pair rate (fallback to EUR triangulation)
  useEffect(() => {
    const calcRate = async () => {
      try {
        const rate = await getPairRate(fromCrypto, toCrypto);
        setExchangeRate(rate);
        if (amount) {
          const estimated = parseFloat(amount) * rate;
          setEstimatedAmount(estimated);
        } else {
          setEstimatedAmount(0);
        }
      } catch (err) {
        console.error('Pair rate error', err);
        setExchangeRate(0);
      }
    };
    calcRate();
  }, [fromCrypto, toCrypto, amount]);

  const handleExchange = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast('Veuillez entrer un montant valide', 'error');
      return;
    }

    if (fromCrypto === toCrypto) {
      toast('Vous ne pouvez pas échanger la même crypto', 'error');
      return;
    }

    if (!user?.id) {
      toast('Utilisateur non connecté', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const amountNum = parseFloat(amount);
      const eurFrom = prices.find(p => p.symbol === fromCrypto)?.price || 0;
      const eurTo = prices.find(p => p.symbol === toCrypto)?.price || 0;
      const usdFrom = eurFrom; // eur value for display; keep field name usd_value to match schema
      const toAmount = estimatedAmount;
      const usdTo = eurTo * toAmount;

      const withdrawTx = await transactionApi.createTransaction({
        user_id: user.id,
        type: 'withdrawal',
        crypto_type: fromCrypto,
        amount: amountNum,
        usd_value: usdFrom,
        status: 'pending',
        fee_amount: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any);

      const depositTx = await transactionApi.createTransaction({
        user_id: user.id,
        type: 'deposit',
        crypto_type: toCrypto,
        amount: toAmount,
        usd_value: usdTo,
        status: 'pending',
        fee_amount: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any);

      if (!withdrawTx || !depositTx) throw new Error('Échec enregistrement échange');

      toast('Échange soumis, en attente de validation admin', 'success');
      setAmount('');
      setEstimatedAmount(0);
    } catch (err) {
      console.error(err);
      toast('Erreur lors de l\'échange', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = fromCrypto;
    setFromCrypto(toCrypto);
    setToCrypto(temp);
  };

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getPriceChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Échange Crypto</h1>
        <p className="text-muted-foreground">
          Échangez vos cryptomonnaies en temps réel
        </p>
      </motion.div>

      {/* Exchange Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Effectuer un échange</CardTitle>
            <CardDescription>
              Taux de change en temps réel (CoinAPI)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* From */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Vous envoyez</label>
              <div className="flex space-x-2">
                <select
                  value={fromCrypto}
                  onChange={(e) => setFromCrypto(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm flex-1"
                >
                  {symbols.map((sym) => (
                    <option key={sym} value={sym}>
                      {sym}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  placeholder="0.00000000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Prix: {utils.formatEUR(prices.find(p => p.symbol === fromCrypto)?.price || 0)}
              </p>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwap}
                className="rounded-full w-10 h-10 p-0"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* To */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Vous recevez</label>
              <div className="flex space-x-2">
                <select
                  value={toCrypto}
                  onChange={(e) => setToCrypto(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm flex-1"
                >
                  {symbols.map((sym) => (
                    <option key={sym} value={sym}>
                      {sym}
                    </option>
                  ))}
                </select>
                <Input
                  value={estimatedAmount.toFixed(8)}
                  readOnly
                  className="flex-1 bg-gray-50"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Prix: {utils.formatEUR(prices.find(p => p.symbol === toCrypto)?.price || 0)}
              </p>
            </div>

            {/* Exchange Rate */}
            {exchangeRate > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Taux de change</span>
                  <span className="text-sm">
                    1 {fromCrypto} = {exchangeRate.toFixed(8)} {toCrypto}
                  </span>
                </div>
              </div>
            )}

            {/* Exchange Button */}
            <Button 
              onClick={handleExchange}
              disabled={loading || !amount || fromCrypto === toCrypto}
              className="w-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Effectuer l'échange
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Market Prices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Prix du Marché (EUR)</CardTitle>
            <CardDescription>
              Données en direct via CoinAPI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {symbols.map((sym) => {
                const price = prices.find(p => p.symbol === sym)?.price || 0;
                const change = 0;
                return (
                  <div key={sym} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-crypto-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{sym}</span>
                      </div>
                      <div>
                        <p className="font-medium">{sym}</p>
                        <p className="text-sm text-muted-foreground">
                          Source: CoinAPI
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{utils.formatEUR(price)}</p>
                      <div className="flex items-center space-x-1">
                        {getPriceChangeIcon(change)}
                        <span className={`text-sm ${getPriceChangeColor(change)}`}>
                          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Exchanges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Échanges Récents</CardTitle>
            <CardDescription>
              Historique de vos derniers échanges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">BTC → ETH</p>
                    <p className="text-sm text-muted-foreground">
                      Exemple visuel
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Terminé</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}; 
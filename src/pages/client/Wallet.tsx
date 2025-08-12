import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Download, 
  Upload, 
  QrCode,
  CheckCircle,
  AlertCircle,
  Clock,
  Wallet as WalletIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth';
import { utils, supabase, transactionApi } from '@/lib/supabase';
import { CryptoWallet, Transaction } from '@/types';
import { useToast } from '@/components/ui/toaster';

export const Wallet = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [depositCrypto, setDepositCrypto] = useState<string>('');
  const [depositAddress, setDepositAddress] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositTxHash, setDepositTxHash] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Load from DB
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Wallets (public, active)
        const { data: w, error: wErr } = await supabase
          .from('crypto_wallets')
          .select('*')
          .eq('is_active', true)
          .order('crypto_type', { ascending: true });
        if (wErr) throw wErr;
        setWallets(w || []);

        if (user?.id) {
          const { data: txs, error: tErr } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          if (tErr) throw tErr;
          setTransactions(txs || []);
        }
      } catch (err) {
        console.error('Failed loading wallet/transactions', err);
        toast('Erreur de chargement du wallet', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.id, toast]);

  const refreshTransactions = async () => {
    if (!user?.id) return;
    const { data: txs } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setTransactions(txs || []);
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast('Adresse copiée !', 'success');
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawAddress || !selectedCrypto) {
      toast('Veuillez remplir tous les champs', 'error');
      return;
    }
    if (!user?.id) {
      toast('Utilisateur non connecté', 'error');
      return;
    }
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast('Montant invalide', 'error');
      return;
    }

    try {
      const newTx = await transactionApi.createTransaction({
        user_id: user.id,
        type: 'withdrawal',
        crypto_type: selectedCrypto,
        amount: amountNum,
        usd_value: 0,
        wallet_address: withdrawAddress,
        fee_amount: 0,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as unknown as Transaction);

      if (!newTx) throw new Error('Création de la transaction échouée');

      toast('Demande de retrait envoyée !', 'success');
      setWithdrawAmount('');
      setWithdrawAddress('');
      setSelectedCrypto('');
      await refreshTransactions();
    } catch (err) {
      console.error(err);
      toast('Erreur lors de la demande de retrait', 'error');
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || !depositCrypto) {
      toast('Veuillez remplir tous les champs', 'error');
      return;
    }
    if (!user?.id) {
      toast('Utilisateur non connecté', 'error');
      return;
    }
    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast('Montant invalide', 'error');
      return;
    }

    try {
      const newTx = await transactionApi.createTransaction({
        user_id: user.id,
        type: 'deposit',
        crypto_type: depositCrypto,
        amount: amountNum,
        usd_value: 0,
        wallet_address: depositAddress,
        transaction_hash: depositTxHash || undefined,
        fee_amount: 0,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as unknown as Transaction);

      if (!newTx) throw new Error('Création de la transaction échouée');

      toast('Demande de dépôt envoyée !', 'success');
      setDepositAmount('');
      setDepositCrypto('');
      setDepositAddress('');
      setDepositTxHash('');
      await refreshTransactions();
    } catch (err) {
      console.error(err);
      toast('Erreur lors de la demande de dépôt', 'error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      default:
        return 'Inconnu';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-crypto-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Wallet Crypto</h1>
        <p className="text-muted-foreground">
          Gérez vos dépôts et retraits de cryptomonnaies
        </p>
      </motion.div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet, index) => (
          <motion.div
            key={wallet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <WalletIcon className="w-5 h-5" />
                  <span>{wallet.crypto_type}</span>
                </CardTitle>
                <CardDescription>
                  Adresse de dépôt pour {wallet.crypto_type}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR Code */}
                <div className="flex justify-center">
                  <img 
                    src={wallet.qr_code_url || ''} 
                    alt={`QR Code ${wallet.crypto_type}`}
                    className="w-32 h-32 border rounded-lg"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adresse de dépôt</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={wallet.address}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyAddress(wallet.address)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => { setDepositCrypto(wallet.crypto_type); setDepositAddress(wallet.address); }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Dépôt
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setSelectedCrypto(wallet.crypto_type)}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Retrait
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Deposit Form */}
      {depositCrypto && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Dépôt {depositCrypto}</CardTitle>
              <CardDescription>
                Envoyez vos {depositCrypto} à l'adresse affichée puis indiquez le montant envoyé.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Montant</label>
                <Input
                  type="number"
                  placeholder="0.00000000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Adresse de dépôt</label>
                <Input
                  value={depositAddress}
                  readOnly
                  className="font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Hash de transaction (optionnel)</label>
                <Input
                  placeholder="tx hash"
                  value={depositTxHash}
                  onChange={(e) => setDepositTxHash(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleDeposit} className="flex-1">
                  Déclarer le dépôt
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { setDepositCrypto(''); setDepositAmount(''); setDepositTxHash(''); setDepositAddress(''); }}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Withdrawal Form */}
      {selectedCrypto && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Retrait {selectedCrypto}</CardTitle>
              <CardDescription>
                Retirez vos {selectedCrypto} vers votre wallet externe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Montant</label>
                <Input
                  type="number"
                  placeholder="0.00000000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Adresse de destination</label>
                <Input
                  placeholder={`Adresse ${selectedCrypto}`}
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleWithdraw} className="flex-1">
                  Demander le retrait
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCrypto('')}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Transactions Récentes</CardTitle>
            <CardDescription>
              Historique de vos dépôts et retraits
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <WalletIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune transaction récente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'deposit' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {transaction.type === 'deposit' ? (
                          <Download className="w-5 h-5" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {transaction.type === 'deposit' ? 'Dépôt' : 'Retrait'} {transaction.crypto_type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {utils.formatCryptoAmount(transaction.amount, transaction.crypto_type, transaction.usd_value)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transaction.status)}
                        <span className={`text-sm font-medium ${
                          transaction.status === 'approved' ? 'text-green-600' :
                          transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {getStatusText(transaction.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {utils.formatDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}; 
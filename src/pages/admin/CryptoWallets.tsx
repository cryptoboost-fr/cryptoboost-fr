import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  QrCode,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  RefreshCw,
  Wallet as WalletIcon,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { utils, supabase } from '@/lib/supabase';
import { CryptoWallet } from '@/types';
import { useToast } from '@/components/ui/toaster';

export const CryptoWallets = () => {
  const { toast } = useToast();
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState<CryptoWallet | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form state for new/edit wallet
  const [formData, setFormData] = useState({
    crypto_type: '',
    address: '',
    is_active: true
  });

  // Load from DB
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('crypto_wallets')
          .select('*')
          .order('crypto_type', { ascending: true });
        if (error) throw error;
        setWallets((data || []) as CryptoWallet[]);
      } catch (err) {
        console.error(err);
        toast('Erreur de chargement des wallets', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const handleAddWallet = () => {
    setIsEditing(false);
    setFormData({ crypto_type: '', address: '', is_active: true });
    setSelectedWallet({} as any);
  };

  const handleEditWallet = (wallet: CryptoWallet) => {
    setIsEditing(true);
    setFormData({ crypto_type: wallet.crypto_type, address: wallet.address, is_active: wallet.is_active });
    setSelectedWallet(wallet);
  };

  const handleSaveWallet = async () => {
    if (!formData.crypto_type || !formData.address) {
      toast('Veuillez remplir tous les champs', 'error');
      return;
    }

    const payload: any = {
      crypto_type: formData.crypto_type.toUpperCase(),
      address: formData.address,
      is_active: formData.is_active,
      qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(formData.address)}`,
    };

    if (isEditing && selectedWallet?.id) {
      const { data, error } = await supabase
        .from('crypto_wallets')
        .update(payload)
        .eq('id', selectedWallet.id)
        .select('*')
        .single();
      if (error) {
        toast("Erreur de mise à jour", 'error');
      } else if (data) {
        setWallets(prev => prev.map(w => w.id === selectedWallet.id ? (data as CryptoWallet) : w));
        toast('Wallet mis à jour avec succès !', 'success');
      }
    } else {
      const { data, error } = await supabase
        .from('crypto_wallets')
        .insert([payload])
        .select('*')
        .single();
      if (error) {
        toast("Erreur d'ajout", 'error');
      } else if (data) {
        setWallets(prev => [...prev, data as CryptoWallet]);
        toast('Wallet ajouté avec succès !', 'success');
      }
    }

    setSelectedWallet(null);
    setFormData({ crypto_type: '', address: '', is_active: true });
  };

  const handleDeleteWallet = async (walletId: string) => {
    const { error } = await supabase
      .from('crypto_wallets')
      .delete()
      .eq('id', walletId);
    if (error) {
      toast('Suppression impossible', 'error');
      return;
    }
    setWallets(prev => prev.filter(w => w.id !== walletId));
    toast('Wallet supprimé !', 'success');
  };

  const handleToggleStatus = async (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (!wallet) return;
    const { data, error } = await supabase
      .from('crypto_wallets')
      .update({ is_active: !wallet.is_active })
      .eq('id', walletId)
      .select('*')
      .single();
    if (!error && data) {
      setWallets(prev => prev.map(w => w.id === walletId ? (data as CryptoWallet) : w));
      toast('Statut du wallet mis à jour !', 'success');
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast('Adresse copiée !', 'success');
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Actif' : 'Inactif';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const filteredWallets = wallets.filter(wallet => {
    const matchesSearch = wallet.crypto_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wallet.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && wallet.is_active) ||
                         (statusFilter === 'inactive' && !wallet.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const activeCount = wallets.filter(w => w.is_active).length;
  const inactiveCount = wallets.filter(w => !w.is_active).length;

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
        <h1 className="text-3xl font-bold">Gestion des Wallets Crypto</h1>
        <p className="text-muted-foreground">
          Configurez les adresses de dépôt pour chaque cryptomonnaie
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Wallets Actifs</p>
                  <p className="text-2xl font-bold text-green-800">{activeCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Wallets Inactifs</p>
                  <p className="text-2xl font-bold text-red-800">{inactiveCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Button onClick={handleAddWallet} className="md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un Wallet
              </Button>
              
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par crypto ou adresse..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                </select>
                <Button variant="outline" size="sm" onClick={async () => {
                  const { data } = await supabase.from('crypto_wallets').select('*').order('crypto_type', { ascending: true });
                  setWallets((data || []) as CryptoWallet[]);
                }}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wallets List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Wallets ({filteredWallets.length})</CardTitle>
            <CardDescription>
              Liste des adresses de dépôt configurées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredWallets.length === 0 ? (
              <div className="text-center py-8">
                <WalletIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun wallet trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWallets.map((wallet) => (
                  <div key={wallet.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <WalletIcon className="w-5 h-5 text-crypto-primary" />
                        <h3 className="font-medium">{wallet.crypto_type}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(wallet.is_active)}`}>
                        {getStatusText(wallet.is_active)}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {/* QR Code */}
                      <div className="flex justify-center">
                        <img 
                          src={wallet.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(wallet.address)}`} 
                          alt={`QR Code ${wallet.crypto_type}`}
                          className="w-24 h-24 border rounded-lg"
                        />
                      </div>
                      
                      {/* Address */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Adresse</label>
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
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditWallet(wallet)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant={wallet.is_active ? "destructive" : "default"}
                          onClick={() => handleToggleStatus(wallet.id)}
                          className="flex-1"
                        >
                          {wallet.is_active ? (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Activer
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteWallet(wallet.id)}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add/Edit Modal */}
      {selectedWallet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedWallet(null)}
        >
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>
                {isEditing ? 'Modifier le Wallet' : 'Ajouter un Wallet'}
              </CardTitle>
              <CardDescription>
                {isEditing ? 'Modifiez les informations du wallet' : 'Configurez un nouveau wallet crypto'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Type de crypto</label>
                <Input
                  placeholder="BTC, ETH, USDT..."
                  value={formData.crypto_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, crypto_type: e.target.value.toUpperCase() }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Adresse</label>
                <Input
                  placeholder="Adresse de dépôt"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  Wallet actif
                </label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSaveWallet} className="flex-1">
                  {isEditing ? 'Mettre à jour' : 'Ajouter'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedWallet(null)}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}; 
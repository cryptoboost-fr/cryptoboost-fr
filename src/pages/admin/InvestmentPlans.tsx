import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { utils, supabase } from '@/lib/supabase';
import { InvestmentPlan } from '@/types';

export const InvestmentPlans = () => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_amount: 0,
    max_amount: '' as string | '' ,
    profit_target: 0,
    duration_days: 30,
    is_active: true,
  });

  // Load plans from DB
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('investment_plans')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setPlans((data || []) as InvestmentPlan[]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openNewPlan = () => {
    setEditingPlan(null);
    setFormData({ name: '', description: '', min_amount: 0, max_amount: '', profit_target: 0, duration_days: 30, is_active: true });
    setShowModal(true);
  };

  const openEditPlan = (plan: InvestmentPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      min_amount: plan.min_amount,
      max_amount: plan.max_amount?.toString() || '',
      profit_target: plan.profit_target,
      duration_days: plan.duration_days,
      is_active: plan.is_active,
    });
    setShowModal(true);
  };

  const savePlan = async () => {
    const payload: any = {
      name: formData.name,
      description: formData.description,
      min_amount: Number(formData.min_amount),
      max_amount: formData.max_amount === '' ? null : Number(formData.max_amount),
      profit_target: Number(formData.profit_target),
      duration_days: Number(formData.duration_days),
      is_active: formData.is_active,
      features: [],
    };

    if (editingPlan) {
      const { data, error } = await supabase
        .from('investment_plans')
        .update(payload)
        .eq('id', editingPlan.id)
        .select('*')
        .single();
      if (!error && data) {
        setPlans(prev => prev.map(p => p.id === editingPlan.id ? (data as InvestmentPlan) : p));
        setShowModal(false);
      }
    } else {
      const { data, error } = await supabase
        .from('investment_plans')
        .insert([{ ...payload }])
        .select('*')
        .single();
      if (!error && data) {
        setPlans(prev => [data as InvestmentPlan, ...prev]);
        setShowModal(false);
      }
    }
  };

  const handleToggleStatus = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const { data, error } = await supabase
      .from('investment_plans')
      .update({ is_active: !plan.is_active })
      .eq('id', planId)
      .select('*')
      .single();
    if (!error && data) {
      setPlans(prev => prev.map(p => p.id === planId ? (data as InvestmentPlan) : p));
    }
  };

  const handleDeletePlan = async (planId: string) => {
    const { error } = await supabase
      .from('investment_plans')
      .delete()
      .eq('id', planId);
    if (error) {
      alert('Suppression impossible: plan référencé par des investissements.');
      return;
    }
    setPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Plans</h1>
            <p className="text-muted-foreground">
              Gérez les plans d'investissement de la plateforme
            </p>
          </div>
          <Button onClick={openNewPlan}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Plan
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{plans.length}</div>
              <p className="text-xs text-muted-foreground">Total Plans</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{plans.filter(p => p.is_active).length}</div>
              <p className="text-xs text-muted-foreground">Plans Actifs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{plans.filter(p => !p.is_active).length}</div>
              <p className="text-xs text-muted-foreground">Plans Inactifs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{utils.formatEUR(plans.reduce((sum, p) => sum + p.min_amount, 0))}</div>
              <p className="text-xs text-muted-foreground">Capital Minimum</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher un plan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plans List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Plans d'Investissement ({filteredPlans.length})</CardTitle>
            <CardDescription>
              Liste des plans disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPlans.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-crypto-primary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{plan.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{plan.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          plan.is_active 
                            ? 'text-green-600 bg-green-100' 
                            : 'text-red-600 bg-red-100'
                        }`}>
                          {plan.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>Min: {utils.formatEUR(plan.min_amount)}</span>
                        {plan.max_amount && <span>Max: {utils.formatEUR(plan.max_amount)}</span>}
                        <span>Profit: {plan.profit_target}%</span>
                        <span>Durée: {plan.duration_days} jours</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditPlan(plan)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(plan.id)}
                    >
                      {plan.is_active ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add/Edit Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>
                {editingPlan ? 'Modifier le Plan' : 'Ajouter un Plan'}
              </CardTitle>
              <CardDescription>
                {editingPlan ? 'Modifiez les informations du plan' : 'Configurez un nouveau plan d\'investissement'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium">Nom</label>
                <Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Min (€)</label>
                  <Input type="number" value={formData.min_amount} onChange={(e) => setFormData(prev => ({ ...prev, min_amount: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Max (€) (optionnel)</label>
                  <Input type="number" value={formData.max_amount} onChange={(e) => setFormData(prev => ({ ...prev, max_amount: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Profit cible (%)</label>
                  <Input type="number" value={formData.profit_target} onChange={(e) => setFormData(prev => ({ ...prev, profit_target: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Durée (jours)</label>
                  <Input type="number" value={formData.duration_days} onChange={(e) => setFormData(prev => ({ ...prev, duration_days: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))} />
                <label htmlFor="is_active" className="text-sm font-medium">Actif</label>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button onClick={savePlan} className="flex-1">{editingPlan ? 'Mettre à jour' : 'Ajouter'}</Button>
                <Button variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}; 
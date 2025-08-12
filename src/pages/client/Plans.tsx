import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  CheckCircle,
  Star,
  DollarSign,
  Calendar,
  Users,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth';
import { utils, supabase, investmentApi, userApi } from '@/lib/supabase';
import { InvestmentPlan, UserInvestment } from '@/types';
import { useToast } from '@/components/ui/toaster';

export const Plans = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load active plans from DB
        const { data: dbPlans, error: pErr } = await supabase
          .from('investment_plans')
          .select('*')
          .eq('is_active', true)
          .order('min_amount', { ascending: true });
        if (pErr) throw pErr;
        setPlans(dbPlans || []);

        if (user?.id) {
          const { data: invs, error: iErr } = await supabase
            .from('user_investments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          if (iErr) throw iErr;
          setUserInvestments(invs || []);
        }
      } catch (err) {
        console.error('Failed loading plans/investments', err);
        toast('Erreur de chargement des plans', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.id, toast]);

  const refreshUserInvestments = async () => {
    if (!user?.id) return;
    const { data: invs } = await supabase
      .from('user_investments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setUserInvestments(invs || []);
  };

  const handleInvest = async () => {
    if (!selectedPlan || !investmentAmount) {
      toast('Veuillez sélectionner un plan et entrer un montant', 'error');
      return;
    }
    if (!user?.id) {
      toast('Utilisateur non connecté', 'error');
      return;
    }
    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount < (selectedPlan.min_amount || 0)) {
      toast(`Le montant doit être au moins ${utils.formatEUR(selectedPlan.min_amount)}`, 'error');
      return;
    }
    if (selectedPlan.max_amount && amount > selectedPlan.max_amount) {
      toast(`Le montant doit être inférieur à ${utils.formatEUR(selectedPlan.max_amount)}`, 'error');
      return;
    }

    try {
      const investment = await investmentApi.createInvestment({
        user_id: user.id,
        plan_id: selectedPlan.id,
        amount,
        profit_target: (amount * (selectedPlan.profit_target / 100)),
        status: 'active',
        start_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      } as unknown as UserInvestment);

      if (!investment) throw new Error('Création investissement échouée');

      toast('Investissement créé avec succès !', 'success');
      setInvestmentAmount('');
      setSelectedPlan(null);
      await refreshUserInvestments();
    } catch (err) {
      console.error(err);
      toast('Erreur lors de la création de l\'investissement', 'error');
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'starter':
        return <Zap className="w-6 h-6" />;
      case 'pro':
        return <TrendingUp className="w-6 h-6" />;
      case 'expert':
        return <Star className="w-6 h-6" />;
      default:
        return <Target className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'completed':
        return 'Terminé';
      case 'pending':
        return 'En attente';
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
        <h1 className="text-3xl font-bold">Packs d'Investissement</h1>
        <p className="text-muted-foreground">
          Choisissez le plan qui correspond à vos objectifs d'investissement
        </p>
      </motion.div>

      {/* User Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-crypto-primary to-crypto-secondary text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Solde disponible</p>
                <p className="text-2xl font-bold">{utils.formatEUR(user?.total_invested || 0)}</p>
              </div>
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Investment Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`relative h-full ${plan.name === 'Pro' ? 'ring-2 ring-crypto-primary' : ''}`}>
              {plan.name === 'Pro' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-crypto-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    Populaire
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getPlanIcon(plan.name)}
                  <span>{plan.name}</span>
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Plan Details */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Profit cible</span>
                    <span className="font-bold text-green-600">{plan.profit_target}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Durée</span>
                    <span className="font-medium">{plan.duration_days} jours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Min/Max</span>
                    <span className="font-medium">
                      {utils.formatEUR(plan.min_amount)} {plan.max_amount ? `- ${utils.formatEUR(plan.max_amount)}` : ''}
                    </span>
                  </div>
                </div>

                {/* Invest Button */}
                <Button 
                  className="w-full" 
                  onClick={() => setSelectedPlan(plan)}
                >
                  Investir maintenant
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Investment Modal */}
      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPlan(null)}
        >
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Investir dans {selectedPlan.name}</CardTitle>
              <CardDescription>
                Entrez le montant que vous souhaitez investir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Montant d'investissement</label>
                <Input
                  type="number"
                  placeholder={`Min: ${utils.formatEUR(selectedPlan.min_amount)}`}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Montant au moins {utils.formatEUR(selectedPlan.min_amount)}{selectedPlan.max_amount ? ` et au plus ${utils.formatEUR(selectedPlan.max_amount)}` : ''}
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Profit cible:</span>
                  <span className="font-medium text-green-600">{selectedPlan.profit_target}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Durée:</span>
                  <span className="font-medium">{selectedPlan.duration_days} jours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Profit estimé:</span>
                  <span className="font-medium">
                    {investmentAmount ? utils.formatEUR(parseFloat(investmentAmount) * selectedPlan.profit_target / 100) : '€0.00'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleInvest} className="flex-1">
                  Confirmer l'investissement
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPlan(null)}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Active Investments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Mes Investissements</CardTitle>
            <CardDescription>
              Suivez vos investissements actifs et leur progression
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userInvestments.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun investissement actif</p>
                <p className="text-sm text-muted-foreground">
                  Commencez par investir dans un de nos packs ci-dessus
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userInvestments.map((investment) => {
                  const plan = plans.find(p => p.id === investment.plan_id);
                  const progress = investment.profit_target > 0 ? (investment.current_profit / investment.profit_target) * 100 : 0;
                  const daysLeft = investment.end_date ? Math.ceil((new Date(investment.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : selectedPlan?.duration_days || 0;
                  
                  return (
                    <div key={investment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{plan?.name || 'Plan'}</h4>
                          <p className="text-sm text-muted-foreground">
                            Investi le {utils.formatDate(investment.start_date)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}>
                          {getStatusText(investment.status)}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Montant investi:</span>
                          <span className="font-medium">{utils.formatEUR(investment.amount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Profit actuel:</span>
                          <span className="font-medium text-green-600">
                            {utils.formatEUR(investment.current_profit)} / {utils.formatEUR(investment.profit_target)}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progression</span>
                            <span>{progress.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {investment.status === 'active' && investment.end_date && (
                          <div className="flex justify-between text-sm">
                            <span>Temps restant:</span>
                            <span className="font-medium">{daysLeft} jours</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}; 
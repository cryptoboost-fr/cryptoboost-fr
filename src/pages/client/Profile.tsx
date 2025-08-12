import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Save, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/components/ui/toaster';
import { userApi } from '@/lib/supabase';

export const Profile = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    country: user?.country || '',
  });

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      const updated = await userApi.updateUser(user.id, {
        full_name: formData.full_name,
        country: formData.country,
      });
      if (updated) {
        useAuthStore.setState({ user: { ...user, ...updated } });
        toast('Profil mis à jour avec succès !', 'success');
        setIsEditing(false);
      } else {
        toast("Erreur lors de la mise à jour du profil", 'error');
      }
    } catch (err) {
      console.error(err);
      toast("Erreur lors de la mise à jour du profil", 'error');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Profil</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Informations Personnelles</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
            </CardTitle>
            <CardDescription>Vos informations de base</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-sm font-medium">Nom complet</label>
                {isEditing ? (
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{user?.full_name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-sm font-medium">Pays</label>
                {isEditing ? (
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="France"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{user?.country || 'Non renseigné'}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  Sauvegarder
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}; 
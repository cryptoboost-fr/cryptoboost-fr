import React from 'react';
import { motion } from 'framer-motion';
import { 
  Newspaper, 
  Mail,
  Phone
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const Press = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-crypto-primary to-crypto-secondary rounded-lg flex items-center justify-center mr-4">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-crypto-primary to-crypto-secondary bg-clip-text text-transparent">
              Presse et Médias
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ressources pour les journalistes et médias
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Contact Presse</h2>
              <p className="text-muted-foreground mb-6">
                Pour toute demande de presse, interview ou information, contactez notre équipe communication.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-crypto-primary" />
                  <span>press@cryptoboost.world</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-crypto-primary" />
                  <span>+33 1 23 45 67 89</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Kit Presse</h2>
              <p className="text-muted-foreground mb-6">
                Téléchargez notre kit presse complet avec logos, images et informations sur l&apos;entreprise.
              </p>
              <Button className="bg-gradient-to-r from-crypto-primary to-crypto-secondary">
                Télécharger le Kit Presse
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cookie, 
  Settings,
  Shield
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const Cookies = () => {
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
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-crypto-primary to-crypto-secondary bg-clip-text text-transparent">
              Politique des Cookies
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dernière mise à jour : 10 Août 2025
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
              <h2 className="text-2xl font-bold mb-4">Qu&apos;est-ce qu&apos;un cookie ?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. 
                Les cookies nous aident à améliorer votre expérience utilisateur et à analyser l&apos;utilisation de notre site.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Types de cookies utilisés</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">Cookies essentiels</h3>
                  <p className="text-muted-foreground">Nécessaires au fonctionnement du site</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Cookies analytiques</h3>
                  <p className="text-muted-foreground">Nous aident à comprendre l&apos;utilisation du site</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Cookies de préférences</h3>
                  <p className="text-muted-foreground">Mémorisent vos choix et préférences</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Gestion des cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vous pouvez contrôler et supprimer les cookies via les paramètres de votre navigateur. 
                Notez que la désactivation de certains cookies peut affecter le fonctionnement du site.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Cookies;
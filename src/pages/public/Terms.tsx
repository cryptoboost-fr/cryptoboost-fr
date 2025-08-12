import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export const Terms = () => {
  const sections = [
    {
      title: '1. Acceptation des Conditions',
      content: `En utilisant CryptoBoost, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.`
    },
    {
      title: '2. Description des Services',
      content: `CryptoBoost est une plateforme de trading automatisé de crypto-monnaies qui utilise l'intelligence artificielle pour optimiser les investissements. Nos services incluent la gestion de portefeuille, l'analyse de marché et l'exécution automatique de trades.`
    },
    {
      title: '3. Inscription et Compte',
      content: `Pour utiliser nos services, vous devez créer un compte en fournissant des informations exactes et à jour. Vous êtes responsable de maintenir la confidentialité de vos identifiants de connexion et de toutes les activités sur votre compte.`
    },
    {
      title: '4. Investissements et Risques',
      content: `L'investissement dans les crypto-monnaies comporte des risques substantiels, y compris la perte totale de votre capital. Les performances passées ne garantissent pas les résultats futurs. Nous ne garantissons aucun rendement sur vos investissements.`
    },
    {
      title: '5. Frais et Commissions',
      content: `CryptoBoost prélève des frais de 2% sur les profits générés. Ces frais sont calculés et prélevés automatiquement. Il n'y a aucun frais d'entrée ou de sortie.`
    },
    {
      title: '6. Sécurité et Protection',
      content: `Nous mettons en œuvre des mesures de sécurité robustes pour protéger vos données et vos fonds. Cependant, aucun système n'est infaillible et nous ne pouvons garantir une sécurité absolue.`
    },
    {
      title: '7. Utilisation Acceptable',
      content: `Vous vous engagez à utiliser nos services uniquement à des fins légales et conformes à ces conditions. Il est interdit d'utiliser nos services pour des activités frauduleuses, de blanchiment d'argent ou d'autres activités illégales.`
    },
    {
      title: '8. Limitation de Responsabilité',
      content: `Dans toute la mesure permise par la loi, CryptoBoost ne sera pas responsable des pertes, dommages ou préjudices indirects, accessoires ou consécutifs résultant de l'utilisation de nos services.`
    },
    {
      title: '9. Propriété Intellectuelle',
      content: `Tous les droits de propriété intellectuelle relatifs à CryptoBoost, y compris les algorithmes, logiciels et contenus, restent la propriété exclusive de CryptoBoost.`
    },
    {
      title: '10. Modifications des Conditions',
      content: `Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet immédiatement après leur publication. Votre utilisation continue des services constitue votre acceptation des nouvelles conditions.`
    },
    {
      title: '11. Résiliation',
      content: `Vous pouvez résilier votre compte à tout moment. Nous pouvons également suspendre ou résilier votre compte en cas de violation de ces conditions ou pour toute autre raison légitime.`
    },
    {
      title: '12. Droit Applicable',
      content: `Ces conditions sont régies par les lois françaises. Tout litige sera soumis à la compétence exclusive des tribunaux français.`
    }
  ];

  const importantNotes = [
    {
      icon: AlertTriangle,
      title: 'Risques d\'Investissement',
      content: 'L\'investissement dans les crypto-monnaies comporte des risques élevés. Ne investissez que ce que vous pouvez vous permettre de perdre.'
    },
    {
      icon: Shield,
      title: 'Sécurité',
      content: 'Nous mettons en œuvre les meilleures pratiques de sécurité, mais la sécurité absolue ne peut être garantie.'
    },
    {
      icon: Clock,
      title: 'Disponibilité',
      content: 'Nos services sont disponibles 24/7, mais peuvent être temporairement indisponibles pour maintenance.'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-crypto-primary to-crypto-secondary rounded-lg flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-crypto-primary to-crypto-secondary bg-clip-text text-transparent">
              Conditions d&apos;Utilisation
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dernière mise à jour : 10 Août 2025
          </p>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {importantNotes.map((note, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <note.icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-foreground">{note.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{note.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Terms Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {sections.map((section, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-foreground">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-crypto-primary/10 to-crypto-secondary/10 border-crypto-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Questions sur nos Conditions ?</h3>
              <p className="text-muted-foreground mb-6">
                Si vous avez des questions concernant ces conditions d&apos;utilisation, n&apos;hésitez pas à nous contacter
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Email : legal@cryptoboost.world</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Support : support@cryptoboost.world</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
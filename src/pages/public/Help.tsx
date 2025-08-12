import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Video,
  FileText,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Comment créer mon premier compte ?',
      answer: 'Pour créer votre compte, cliquez sur "S\'inscrire" en haut à droite, remplissez le formulaire avec votre email et mot de passe, puis confirmez votre email. Votre compte sera activé immédiatement après confirmation.'
    },
    {
      question: 'Comment fonctionne l\'investissement automatisé ?',
      answer: 'Nos algorithmes d\'IA analysent en temps réel les marchés crypto pour identifier les meilleures opportunités. Une fois que vous choisissez un plan d\'investissement, notre système gère automatiquement vos positions pour maximiser vos profits.'
    },
    {
      question: 'Quels sont les frais de la plateforme ?',
      answer: 'CryptoBoost applique des frais de 2% sur les profits générés. Il n\'y a aucun frais d\'entrée ou de sortie. Les frais ne sont prélevés que sur les gains réalisés.'
    },
    {
      question: 'Comment retirer mes fonds ?',
      answer: 'Pour retirer vos fonds, allez dans votre Wallet, sélectionnez "Retrait", choisissez la crypto-monnaie et le montant, puis confirmez. Les retraits sont traités sous 24h.'
    },
    {
      question: 'La plateforme est-elle sécurisée ?',
      answer: 'Absolument. Nous utilisons le chiffrement SSL/TLS, l\'authentification à deux facteurs, et vos fonds restent sur vos comptes d\'échange. Nous ne stockons jamais vos clés privées.'
    },
    {
      question: 'Quels sont les cryptos supportés ?',
      answer: 'Nous supportons Bitcoin (BTC), Ethereum (ETH), USDT, USDC, BNB et de nombreuses autres cryptos populaires. La liste complète est disponible dans votre dashboard.'
    }
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      title: 'Chat en Direct',
      description: 'Support 24/7 en temps réel',
      response: 'Réponse immédiate',
      color: 'bg-green-100 text-green-700'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Support détaillé par email',
      response: 'Réponse sous 2h',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      icon: Phone,
      title: 'Support Téléphonique',
      description: 'Appel direct avec nos experts',
      response: 'Disponible 9h-18h',
      color: 'bg-purple-100 text-purple-700'
    }
  ];

  const resources = [
    {
      icon: BookOpen,
      title: 'Guide de Démarrage',
      description: 'Tout ce que vous devez savoir pour commencer',
      href: '/guide'
    },
    {
      icon: Video,
      title: 'Tutoriels Vidéo',
      description: 'Vidéos explicatives étape par étape',
      href: '/tutorials'
    },
    {
      icon: FileText,
      title: 'Documentation API',
      description: 'Guide complet pour développeurs',
      href: '/api'
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Rejoignez notre communauté d\'investisseurs',
      href: '/community'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-crypto-primary to-crypto-secondary bg-clip-text text-transparent">
              Centre d&apos;Aide
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trouvez rapidement les réponses à vos questions et obtenez l&apos;aide dont vous avez besoin
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Rechercher dans l'aide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </motion.div>

        {/* Support Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Canaux de Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`inline-block p-3 rounded-full mb-4 ${channel.color}`}>
                    <channel.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{channel.title}</h3>
                  <p className="text-muted-foreground mb-3">{channel.description}</p>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{channel.response}</span>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-crypto-primary to-crypto-secondary">
                    Contacter
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Questions Fréquentes</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFaqs.map((faq, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-border"
                    >
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Ressources Utiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-gradient-to-r from-crypto-primary/10 to-crypto-secondary/10 rounded-lg inline-block mb-4 group-hover:from-crypto-primary/20 group-hover:to-crypto-secondary/20 transition-all duration-300">
                    <resource.icon className="w-6 h-6 text-crypto-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <Button variant="outline" className="w-full">
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-crypto-primary/10 to-crypto-secondary/10 border-crypto-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Besoin d&apos;aide supplémentaire ?</h3>
              <p className="text-muted-foreground mb-6">
                Notre équipe d&apos;experts est là pour vous aider 24h/24 et 7j/7
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-crypto-primary to-crypto-secondary">
                  Contacter le Support
                </Button>
                <Button variant="outline" size="lg">
                  Planifier un Appel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
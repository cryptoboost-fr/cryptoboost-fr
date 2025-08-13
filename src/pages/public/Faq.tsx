import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const Faq = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqCategories = [
    {
      title: 'Compte et Inscription',
      icon: '👤',
      faqs: [
        {
          question: 'Comment créer mon compte CryptoBoost ?',
          answer: 'Cliquez sur "S\'inscrire" en haut à droite, remplissez le formulaire avec votre email et mot de passe, puis confirmez votre email. Votre compte sera activé immédiatement après confirmation.'
        },
        {
          question: 'Puis-je utiliser la même adresse email pour plusieurs comptes ?',
          answer: 'Non, chaque adresse email ne peut être utilisée que pour un seul compte CryptoBoost. C\'est une mesure de sécurité pour protéger vos investissements.'
        },
        {
          question: 'Comment réinitialiser mon mot de passe ?',
          answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion, entrez votre email, et suivez les instructions envoyées par email pour créer un nouveau mot de passe.'
        }
      ]
    },
    {
      title: 'Investissements',
      icon: '💰',
      faqs: [
        {
          question: 'Comment fonctionne l\'investissement automatisé ?',
          answer: 'Nos algorithmes d\'IA analysent en temps réel les marchés crypto pour identifier les meilleures opportunités. Une fois que vous choisissez un plan d\'investissement, notre système gère automatiquement vos positions pour maximiser vos profits.'
        },
        {
          question: 'Quels sont les frais de la plateforme ?',
          answer: 'CryptoBoost applique des frais de 2% sur les profits générés. Il n\'y a aucun frais d\'entrée ou de sortie. Les frais ne sont prélevés que sur les gains réalisés.'
        },
        {
          question: 'Quel est le montant minimum pour investir ?',
          answer: 'Le montant minimum varie selon les plans d\'investissement, généralement entre 50€ et 500€. Consultez la page des plans pour voir les détails de chaque offre.'
        },
        {
          question: 'Combien de temps durent les investissements ?',
          answer: 'La durée varie selon le plan choisi : de 30 jours pour les plans courts à 365 jours pour les plans longs. Vous pouvez retirer vos fonds à tout moment.'
        }
      ]
    },
    {
      title: 'Sécurité',
      icon: '🔒',
      faqs: [
        {
          question: 'La plateforme est-elle sécurisée ?',
          answer: 'Absolument. Nous utilisons le chiffrement SSL/TLS, l\'authentification à deux facteurs, et vos fonds restent sur vos comptes d\'échange. Nous ne stockons jamais vos clés privées.'
        },
        {
          question: 'Mes fonds sont-ils assurés ?',
          answer: 'Oui, tous les fonds sont protégés par notre assurance crypto. En cas de problème, vous êtes couvert jusqu\'à 100% de vos investissements.'
        },
        {
          question: 'Comment activer l\'authentification à deux facteurs ?',
          answer: 'Allez dans votre profil, section "Sécurité", et suivez les instructions pour configurer l\'authentification à deux facteurs avec Google Authenticator ou SMS.'
        }
      ]
    },
    {
      title: 'Dépôts et Retraits',
      icon: '💳',
      faqs: [
        {
          question: 'Comment déposer des fonds ?',
          answer: 'Allez dans votre Wallet, cliquez sur "Dépôt", choisissez la crypto-monnaie, copiez l\'adresse ou scannez le QR code, et envoyez vos fonds depuis votre wallet externe.'
        },
        {
          question: 'Comment retirer mes fonds ?',
          answer: 'Pour retirer vos fonds, allez dans votre Wallet, sélectionnez "Retrait", choisissez la crypto-monnaie et le montant, puis confirmez. Les retraits sont traités sous 24h.'
        },
        {
          question: 'Quels sont les délais de traitement ?',
          answer: 'Les dépôts sont crédités immédiatement après confirmation blockchain. Les retraits sont traités sous 24h maximum, généralement en quelques heures.'
        },
        {
          question: 'Y a-t-il des frais de retrait ?',
          answer: 'Les frais de retrait correspondent aux frais de réseau de la blockchain. CryptoBoost ne prélève aucun frais supplémentaire sur les retraits.'
        }
      ]
    },
    {
      title: 'Cryptos Supportées',
      icon: '🪙',
      faqs: [
        {
          question: 'Quels sont les cryptos supportés ?',
          answer: 'Nous supportons Bitcoin (BTC), Ethereum (ETH), USDT, USDC, BNB et de nombreuses autres cryptos populaires. La liste complète est disponible dans votre dashboard.'
        },
        {
          question: 'Puis-je investir en euros ?',
          answer: 'Oui, vous pouvez déposer des euros via virement bancaire SEPA ou carte bancaire, puis les convertir en crypto-monnaies pour investir.'
        },
        {
          question: 'Les prix sont-ils en temps réel ?',
          answer: 'Oui, tous les prix sont mis à jour en temps réel grâce à nos partenariats avec les principales bourses crypto mondiales.'
        }
      ]
    },
    {
      title: 'Support et Assistance',
      icon: '🎧',
      faqs: [
        {
          question: 'Comment contacter le support ?',
          answer: 'Vous pouvez nous contacter via le chat en direct 24/7, par email à support@cryptoboost.world, ou par téléphone du lundi au vendredi de 9h à 18h.'
        },
        {
          question: 'Quels sont les délais de réponse ?',
          answer: 'Chat en direct : réponse immédiate. Email : réponse sous 2h maximum. Téléphone : réponse immédiate pendant les heures d\'ouverture.'
        },
        {
          question: 'Puis-je annuler un investissement ?',
          answer: 'Vous pouvez retirer vos fonds à tout moment, mais les frais de 2% sur les profits s\'appliquent si vous retirez avant la fin du plan d\'investissement.'
        }
      ]
    }
  ];

  const allFaqs = faqCategories.flatMap(category => 
    category.faqs.map(faq => ({
      ...faq,
      category: category.title
    }))
  );

  const filteredFaqs = allFaqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
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
              Questions Fréquentes
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trouvez rapidement les réponses à toutes vos questions sur CryptoBoost
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
                placeholder="Rechercher dans les FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        {!searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Catégories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faqCategories.map((category, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.faqs.length} questions
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: searchTerm ? 0.1 : 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            {searchTerm ? `Résultats pour "${searchTerm}"` : 'Toutes les Questions'}
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFaqs.map((faq, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="mb-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                      {faq.category}
                    </span>
                  </div>
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

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-crypto-primary/10 to-crypto-secondary/10 border-crypto-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Vous n&apos;avez pas trouvé votre réponse ?</h3>
              <p className="text-muted-foreground mb-6">
                Notre équipe d&apos;experts est là pour vous aider
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-crypto-primary to-crypto-secondary">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat en Direct
                </Button>
                <Button variant="outline" size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer un Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Faq;
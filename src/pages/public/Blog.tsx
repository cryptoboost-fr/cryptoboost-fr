import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const Blog = () => {
  const articles = [
    {
      title: 'L\'avenir du trading automatisé avec l\'IA',
      excerpt: 'Découvrez comment l\'intelligence artificielle révolutionne le trading de crypto-monnaies et maximise vos profits.',
      author: 'Équipe CryptoBoost',
      date: '10 Août 2025',
      readTime: '5 min',
      category: 'Trading IA'
    },
    {
      title: 'Guide complet des stratégies d\'investissement crypto',
      excerpt: 'Apprenez les meilleures stratégies pour investir dans les crypto-monnaies et optimiser votre portefeuille.',
      author: 'Équipe CryptoBoost',
      date: '8 Août 2025',
      readTime: '8 min',
      category: 'Investissement'
    },
    {
      title: 'Sécurité des crypto-monnaies : bonnes pratiques',
      excerpt: 'Protégez vos investissements crypto avec ces conseils de sécurité essentiels.',
      author: 'Équipe CryptoBoost',
      date: '5 Août 2025',
      readTime: '6 min',
      category: 'Sécurité'
    }
  ];

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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-crypto-primary to-crypto-secondary bg-clip-text text-transparent">
              Blog CryptoBoost
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Actualités, conseils et analyses sur le trading automatisé et les crypto-monnaies
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {articles.map((article, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4">
                  <span className="text-xs bg-crypto-primary/10 text-crypto-primary px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-crypto-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{article.readTime} de lecture</span>
                  <Button variant="ghost" size="sm" className="group-hover:text-crypto-primary">
                    Lire plus <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
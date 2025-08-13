import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Code,
  Github
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const Licenses = () => {
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
              Licences et Attributions
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Informations sur les licences utilisées dans notre plateforme
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
              <h2 className="text-2xl font-bold mb-4">Licence CryptoBoost</h2>
              <p className="text-muted-foreground leading-relaxed">
                CryptoBoost est une plateforme propriétaire. Tous les droits sont réservés à CryptoBoost SAS.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Bibliothèques Open Source</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">React</h3>
                  <p className="text-muted-foreground">Licence MIT - Facebook</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">TypeScript</h3>
                  <p className="text-muted-foreground">Licence Apache 2.0 - Microsoft</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Tailwind CSS</h3>
                  <p className="text-muted-foreground">Licence MIT - Tailwind Labs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Licenses;
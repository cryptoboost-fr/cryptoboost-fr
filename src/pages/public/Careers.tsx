import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const Careers = () => {
  const jobs = [
    {
      title: 'Développeur Full-Stack Senior',
      location: 'Paris, France',
      type: 'CDI',
      department: 'Engineering',
      description: 'Rejoignez notre équipe pour développer la prochaine génération de plateformes de trading automatisé.'
    },
    {
      title: 'Data Scientist',
      location: 'Remote',
      type: 'CDI',
      department: 'AI/ML',
      description: 'Développez des algorithmes d\'IA avancés pour optimiser nos stratégies de trading.'
    },
    {
      title: 'Product Manager',
      location: 'Paris, France',
      type: 'CDI',
      department: 'Product',
      description: 'Dirigez le développement de produits innovants dans l\'écosystème crypto.'
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
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-crypto-primary to-crypto-secondary bg-clip-text text-transparent">
              Rejoignez Notre Équipe
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Faites partie de la révolution du trading automatisé et de l&apos;intelligence artificielle
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {jobs.map((job, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4">
                  <span className="text-xs bg-crypto-primary/10 text-crypto-primary px-2 py-1 rounded-full">
                    {job.department}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-crypto-primary transition-colors">
                  {job.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {job.description}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-crypto-primary to-crypto-secondary">
                  Postuler <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, FileText, GraduationCap, Database, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const migrationOptions = [
    {
      id: 'inscripciones',
      title: 'Migrar Inscripciones',
      icon: FileText,
      color: 'text-purple-600',
    },

    {
      id: 'pagos',
      title: 'Migrar Pagos',
      description: 'Dashboard de importación de pagos y transacciones',
      icon: BookOpen,
      color: 'text-emerald-600',
    },
  ];

  return (
    <Layout title="Catálogo de Migraciones">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {migrationOptions.map((option) => (
          <Card
            key={option.id}
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => navigate(`/migrate/${option.id}`)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <option.icon className={`h-6 w-6 ${option.color}`} />
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {option.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {option.description}
              </CardDescription>
              <Button variant="outline" className="w-full">
                Comenzar Migración
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Dashboard;
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, FileText, GraduationCap, Database, BarChart3 } from 'lucide-react';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const migrationOptions = [
    {
      id: 'estudiantes',
      title: 'Migrar Estudiantes',
      description: 'Importar datos de estudiantes (StudentsImport.php)',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      id: 'usuarios',
      title: 'Migrar Usuarios',
      description: 'Importar usuarios del sistema (UserImport.php)',
      icon: GraduationCap,
      color: 'text-green-600',
    },
    {
      id: 'inscripciones',
      title: 'Migrar Inscripciones',
      description: 'Procesar inscripciones de estudiantes (InscripcionesImport.php)',
      icon: FileText,
      color: 'text-purple-600',
    },
    {
      id: 'prospectos',
      title: 'Migrar Prospectos',
      description: 'Importar prospectos y leads (ProspectosImport.php)',
      icon: Database,
      color: 'text-orange-600',
    },
    {
      id: 'estados-cuenta',
      title: 'Estados de Cuenta',
      description: 'Procesar estados de cuenta bancarios (BankStatementImport.php)',
      icon: BarChart3,
      color: 'text-indigo-600',
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
            onClick={() => onNavigate(`/migrate/${option.id}`)}
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

      <div className="mt-12 text-center">
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">¿Necesitas ayuda?</h3>
            <p className="text-muted-foreground mb-4">
              Consulta nuestra documentación para obtener guías detalladas sobre cada tipo de migración.
            </p>
            <Button variant="secondary">
              Ver Documentación
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
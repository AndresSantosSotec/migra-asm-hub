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
      description: 'Importar datos de estudiantes desde archivos CSV o Excel',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      id: 'cursos',
      title: 'Migrar Cursos',
      description: 'Cargar información de cursos y materias',
      icon: BookOpen,
      color: 'text-green-600',
    },
    {
      id: 'paginas',
      title: 'Migrar Páginas',
      description: 'Transferir contenido de páginas web',
      icon: FileText,
      color: 'text-purple-600',
    },
    {
      id: 'profesores',
      title: 'Migrar Profesores',
      description: 'Importar datos del personal docente',
      icon: GraduationCap,
      color: 'text-orange-600',
    },
    {
      id: 'calificaciones',
      title: 'Migrar Calificaciones',
      description: 'Transferir registros académicos y notas',
      icon: BarChart3,
      color: 'text-red-600',
    },
    {
      id: 'contenido',
      title: 'Migrar Contenido',
      description: 'Mover archivos y recursos educativos',
      icon: Database,
      color: 'text-indigo-600',
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
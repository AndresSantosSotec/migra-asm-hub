import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MigrationPageProps {
  type: string;
  onBack: () => void;
}

const MigrationPage = ({ type, onBack }: MigrationPageProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [skipErrors, setSkipErrors] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const typeLabels: Record<string, string> = {
    estudiantes: 'Estudiantes',
    cursos: 'Cursos',
    paginas: 'Páginas',
    profesores: 'Profesores',
    calificaciones: 'Calificaciones',
    contenido: 'Contenido',
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo primero",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "¡Importación exitosa!",
        description: `Se han procesado los ${typeLabels[type].toLowerCase()} correctamente`,
      });
      
      setSelectedFile(null);
      setSkipErrors(false);
    } catch (error) {
      toast({
        title: "Error en la importación",
        description: "Hubo un problema al procesar el archivo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout 
      title={`Migrar ${typeLabels[type]}`}
      showBackButton
      onBack={onBack}
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Archivo CSV o Excel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Seleccionar archivo</Label>
            <div className="relative">
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
              {selectedFile && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
            {!selectedFile && (
              <p className="text-sm text-muted-foreground">
                Sin archivos seleccionados
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="skip-errors" 
              checked={skipErrors}
              onCheckedChange={(checked) => setSkipErrors(checked === true)}
            />
            <Label htmlFor="skip-errors" className="text-sm">
              Omitir errores y continuar con los registros válidos
            </Label>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleImport}
              disabled={!selectedFile || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Importando...
                </>
              ) : (
                `Importar ${typeLabels[type]}`
              )}
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Formato del archivo:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Formatos admitidos: CSV, Excel (.xlsx, .xls)</li>
              <li>• Primera fila debe contener los nombres de las columnas</li>
              <li>• Codificación UTF-8 recomendada para caracteres especiales</li>
              <li>• Tamaño máximo: 10 MB</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default MigrationPage;
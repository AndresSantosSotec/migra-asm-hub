import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { getToken } from '@/lib/auth';

const PagosImportDashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState({ title: '', description: '', variant: '' });

  const [importStats, setImportStats] = useState({
    totalTransactions: 0,
    successfulImports: 0,
    failedImports: 0,
    totalAmount: 0,
  });

  // 🎯 DEBUG: Mostrar ambiente al cargar la página
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
      console.log('🌧️ RICE SHOWER - Apuntando a LOCAL:', apiUrl);
    } else {
      console.log('🎊 TOKAITEIO - Apuntando a PRODUCCIÓN:', apiUrl);
    }
  }, []);

  const showToast = (title, description, variant = 'default') => {
    setToastMessage({ title, description, variant });
    setTimeout(() => setToastMessage({ title: '', description: '', variant: '' }), 3000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      showToast("Error", "Por favor selecciona un archivo primero", "destructive");
      return;
    }

    setIsProcessing(true);
    setImportProgress(0);
    let progressInterval;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Simular progreso visual
      progressInterval = setInterval(() => {
        setImportProgress((prev) => Math.min(prev + 15, 90));
      }, 300);

      // Obtener la URL base de la API desde las variables de entorno
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      
      // 🎯 DEBUG: Identificar ambiente
      if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
        console.log('🌧️ RICE SHOWER - ', apiUrl);
      } else {
        console.log('🎊 TOKAI TEIO - ', apiUrl);
      }
      
      const token = getToken();

      const response = await fetch(`${apiUrl}/conciliacion/import-kardex`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setImportProgress(100);

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error('El servidor no devolvió JSON. Verifica el endpoint.');
      }

      const data = await response.json();

      if (response.ok && data.success) {
        // Actualizar estadísticas de forma segura
        const stats = data.stats || {};
        setImportStats({
          totalTransactions: stats.totalTransactions || 0,
          successfulImports: stats.successfulImports || 0,
          failedImports: stats.failedImports || 0,
          totalAmount: stats.totalAmount || 0,
        });

        showToast(
          "¡Importación exitosa!",
          `Se procesaron ${stats.successfulImports || 0} registros correctamente`
        );

        // Limpiar el archivo
        setSelectedFile(null);
        const fileInput = document.getElementById('file-upload');
        if (fileInput instanceof HTMLInputElement) fileInput.value = '';
      } else {
        throw new Error(data.message || data.error || 'Error al procesar el archivo');
      }
//2905Andres@ouguricap777calorias
// #1.own
// #2.trip
// #3.scout
// #4.teach
// #5.system
// #6.liberty
// #7.chronic
// #8.retreat
// #9.slab
// #10.rabbit
// #11.elbow
// #12.envelope
    } catch (error) {
      console.error('Error en importación:', error);
      showToast(
        "Error en la importación",
        error instanceof Error ? error.message : "No se pudo procesar el archivo",
        "destructive"
      );
    } finally {
      if (progressInterval) clearInterval(progressInterval);
      setIsProcessing(false);
      setTimeout(() => setImportProgress(0), 1000);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard de Importación de Pagos</h1>
      </div>

      {toastMessage.title && (
        <div className={`mb-4 p-4 rounded-lg ${toastMessage.variant === 'destructive' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          <h3 className="font-semibold">{toastMessage.title}</h3>
          <p className="text-sm">{toastMessage.description}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transacciones</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{importStats.totalTransactions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Importaciones Exitosas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{importStats.successfulImports}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Errores</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{importStats.failedImports}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${importStats.totalAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Import Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importar Archivo de Pagos
            </CardTitle>
            <CardDescription>
              Sube un archivo CSV o Excel con los datos de pagos para procesar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Seleccionar archivo</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="cursor-pointer"
                disabled={isProcessing}
              />
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Procesando archivo...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} className="w-full" />
              </div>
            )}

            <Button
              onClick={handleImport}
              disabled={!selectedFile || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Procesar Pagos
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Format Requirements */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Formato Requerido para Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Columnas requeridas:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• ID Estudiante</li>
                  <li>• Monto</li>
                  <li>• Fecha de Pago</li>
                  <li>• Método de Pago</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Columnas opcionales:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Referencia/Folio</li>
                  <li>• Concepto</li>
                  <li>• Estado</li>
                  <li>• Observaciones</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PagosImportDashboard;
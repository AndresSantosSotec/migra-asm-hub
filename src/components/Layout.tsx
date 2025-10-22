import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '@/hooks/use-auth';

interface LayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
}

const Layout = ({ children, showBackButton, onBack, title }: LayoutProps) => {
  const navigate = useNavigate();
  const { handleLogout, loading } = useLogout();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium text-foreground">Manteniminetos ASM</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {loading ? 'Cerrando...' : 'Cerrar sesión'}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {title && (
            <h2 className="text-2xl font-semibold text-primary">{title}</h2>
          )}
          {showBackButton && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="ml-auto"
            >
              ← Volver
            </Button>
          )}
        </div>
        {children}
      </main>
    </div>
  );
};

export default Layout;
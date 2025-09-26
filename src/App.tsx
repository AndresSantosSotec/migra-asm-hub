import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MigrationPage from "./pages/MigrationPage";
import PagosImportDashboard from "./pages/PagosImportDashboard";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (path: string) => {
    setCurrentPage(path);
  };

  const handleBack = () => {
    setCurrentPage('dashboard');
  };

  const renderCurrentPage = () => {
    if (currentPage === 'dashboard') {
      return <Dashboard onNavigate={handleNavigate} />;
    } else if (currentPage.startsWith('/migrate/')) {
      const type = currentPage.split('/')[2];
      if (type === 'pagos') {
        return <PagosImportDashboard onBack={handleBack} />;
      }
      return <MigrationPage type={type} onBack={handleBack} />;
    }
    return <Dashboard onNavigate={handleNavigate} />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : (
          renderCurrentPage()
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

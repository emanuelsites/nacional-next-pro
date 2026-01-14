import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { VisualEditorProvider } from "@/contexts/VisualEditorContext";
import AdminEditorBar from "@/components/visual-editor/AdminEditorBar";
import Index from "./pages/Index";
import Cursos from "./pages/Cursos";
import CursoDetalhe from "./pages/CursoDetalhe";
import Contato from "./pages/Contato";
import Institucional from "./pages/Institucional";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCursos from "./pages/AdminCursos";
import AdminInscritos from "./pages/AdminInscritos";
import AdminBanners from "./pages/AdminBanners";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <VisualEditorProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AdminEditorBar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cursos" element={<Cursos />} />
              <Route path="/curso/:slug" element={<CursoDetalhe />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/institucional" element={<Institucional />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="cursos" element={<AdminCursos />} />
                <Route path="inscritos" element={<AdminInscritos />} />
                <Route path="banners" element={<AdminBanners />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </VisualEditorProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

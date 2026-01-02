import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { Button } from '@/components/ui/button';
import { LogOut, Save, Edit, X, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminEditorBar() {
  const { isAdmin, signOut, user } = useAuth();
  const { isEditing, setIsEditing, saveAllChanges, discardChanges, hasChanges, isSaving } = useVisualEditor();

  // Set CSS variable for page padding
  useEffect(() => {
    if (isAdmin) {
      document.documentElement.style.setProperty('--admin-bar-height', isEditing ? '80px' : '48px');
    } else {
      document.documentElement.style.setProperty('--admin-bar-height', '0px');
    }
    return () => {
      document.documentElement.style.setProperty('--admin-bar-height', '0px');
    };
  }, [isAdmin, isEditing]);

  if (!isAdmin) return null;

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[9999] bg-primary text-primary-foreground shadow-lg"
      >
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium">
                Logado como Admin: {user?.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                {hasChanges && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={discardChanges}
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Descartar
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={saveAllChanges}
                  disabled={!hasChanges || isSaving}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-1" />
                  )}
                  Salvar Alterações
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Finalizar Edição
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar Página
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sair
            </Button>
          </div>
        </div>

        {isEditing && (
          <div className="bg-yellow-500 text-yellow-900 text-center py-1 text-sm font-medium">
            Modo de Edição Ativo - Clique em qualquer texto ou imagem para editar
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

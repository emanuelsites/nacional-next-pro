import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface ContentItem {
  id?: string;
  content_key: string;
  content_value: string;
  content_type: 'text' | 'image' | 'html';
  page: string;
}

interface VisualEditorContextType {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  content: Record<string, ContentItem>;
  pendingChanges: Record<string, ContentItem>;
  updateContent: (key: string, value: string, type: 'text' | 'image' | 'html', page?: string) => void;
  saveAllChanges: () => Promise<void>;
  discardChanges: () => void;
  getContent: (key: string, defaultValue: string) => string;
  hasChanges: boolean;
  isSaving: boolean;
}

const VisualEditorContext = createContext<VisualEditorContextType | undefined>(undefined);

export function VisualEditorProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<Record<string, ContentItem>>({});
  const [pendingChanges, setPendingChanges] = useState<Record<string, ContentItem>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load all content from database
  useEffect(() => {
    const loadContent = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');
      
      if (error) {
        console.error('Error loading site content:', error);
        return;
      }

      const contentMap: Record<string, ContentItem> = {};
      data?.forEach((item: any) => {
        contentMap[item.content_key] = {
          id: item.id,
          content_key: item.content_key,
          content_value: item.content_value || '',
          content_type: item.content_type,
          page: item.page
        };
      });
      setContent(contentMap);
    };

    loadContent();
  }, []);

  const updateContent = useCallback((key: string, value: string, type: 'text' | 'image' | 'html', page: string = 'global') => {
    setPendingChanges(prev => ({
      ...prev,
      [key]: {
        content_key: key,
        content_value: value,
        content_type: type,
        page,
        id: content[key]?.id
      }
    }));
  }, [content]);

  const getContent = useCallback((key: string, defaultValue: string): string => {
    // First check pending changes
    if (pendingChanges[key]) {
      return pendingChanges[key].content_value;
    }
    // Then check saved content
    if (content[key]) {
      return content[key].content_value;
    }
    return defaultValue;
  }, [content, pendingChanges]);

  const saveAllChanges = useCallback(async () => {
    if (Object.keys(pendingChanges).length === 0) {
      toast.info('Nenhuma alteração para salvar');
      return;
    }

    setIsSaving(true);
    try {
      const operations = Object.values(pendingChanges).map(async (item) => {
        if (item.id) {
          // Update existing
          const { error } = await supabase
            .from('site_content')
            .update({
              content_value: item.content_value,
              content_type: item.content_type,
              page: item.page
            })
            .eq('id', item.id);
          
          if (error) throw error;
        } else {
          // Insert new
          const { error } = await supabase
            .from('site_content')
            .upsert({
              content_key: item.content_key,
              content_value: item.content_value,
              content_type: item.content_type,
              page: item.page
            }, { onConflict: 'content_key' });
          
          if (error) throw error;
        }
      });

      await Promise.all(operations);
      
      // Merge pending changes into content
      setContent(prev => {
        const updated = { ...prev };
        Object.entries(pendingChanges).forEach(([key, value]) => {
          updated[key] = value;
        });
        return updated;
      });
      
      setPendingChanges({});
      toast.success('Alterações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  }, [pendingChanges]);

  const discardChanges = useCallback(() => {
    setPendingChanges({});
    toast.info('Alterações descartadas');
  }, []);

  const hasChanges = Object.keys(pendingChanges).length > 0;

  // Disable editing if not admin
  useEffect(() => {
    if (!isAdmin && isEditing) {
      setIsEditing(false);
    }
  }, [isAdmin, isEditing]);

  return (
    <VisualEditorContext.Provider value={{
      isEditing: isAdmin && isEditing,
      setIsEditing,
      content,
      pendingChanges,
      updateContent,
      saveAllChanges,
      discardChanges,
      getContent,
      hasChanges,
      isSaving
    }}>
      {children}
    </VisualEditorContext.Provider>
  );
}

export function useVisualEditor() {
  const context = useContext(VisualEditorContext);
  if (context === undefined) {
    throw new Error('useVisualEditor must be used within a VisualEditorProvider');
  }
  return context;
}

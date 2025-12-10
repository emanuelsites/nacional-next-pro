import React, { createContext, useContext, useState, ReactNode } from 'react';
import { courses as initialCourses, Course } from '@/data/courses';

export interface Enrollment {
  id: string;
  courseId: string;
  courseName: string;
  type: 'pessoa_fisica' | 'pessoa_juridica';
  // Pessoa Física
  nomeCompleto?: string;
  cpf?: string;
  // Pessoa Jurídica
  nomeEmpresa?: string;
  cnpj?: string;
  // Comum
  telefoneFixo: string;
  telefoneCelular: string;
  email: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  // Responsáveis (PJ)
  responsavelInscricao?: {
    nome: string;
    cpf: string;
    telefoneFixo: string;
    telefoneCelular: string;
    email: string;
  };
  responsavelPagamento?: {
    nome: string;
    cpf: string;
    telefoneFixo: string;
    telefoneCelular: string;
    email: string;
  };
  participantes?: Array<{
    nome: string;
    telefoneFixo: string;
    telefoneCelular: string;
    email: string;
  }>;
  createdAt: Date;
}

interface DataContextType {
  courses: Course[];
  enrollments: Enrollment[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addEnrollment: (enrollment: Omit<Enrollment, 'id' | 'createdAt'>) => void;
  deleteEnrollment: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const updateCourse = (id: string, courseData: Partial<Course>) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === id ? { ...course, ...courseData } : course
      )
    );
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  const addEnrollment = (enrollment: Omit<Enrollment, 'id' | 'createdAt'>) => {
    const newEnrollment: Enrollment = {
      ...enrollment,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setEnrollments(prev => [...prev, newEnrollment]);
  };

  const deleteEnrollment = (id: string) => {
    setEnrollments(prev => prev.filter(e => e.id !== id));
  };

  return (
    <DataContext.Provider value={{
      courses,
      enrollments,
      addCourse,
      updateCourse,
      deleteCourse,
      addEnrollment,
      deleteEnrollment,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}


import { User, UserRole } from './types';

// Mock users data
export const mockUsers: User[] = [
  {
    id: '1',
    nombre: 'Ana',
    apellidos: 'García',
    email: 'ana.garcia@empresa.com',
    telefono: '600123456',
    rol: 'rrhh',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: '2',
    nombre: 'Pedro',
    apellidos: 'López',
    email: 'pedro.lopez@empresa.com',
    telefono: '600789123',
    rol: 'trabajador',
    fechaContratacion: '2020-03-15',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: '3',
    nombre: 'Laura',
    apellidos: 'Martínez',
    email: 'laura.martinez@empresa.com',
    telefono: '600456789',
    rol: 'trabajador',
    fechaContratacion: '2019-07-22',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: '4',
    nombre: 'Carlos',
    apellidos: 'Sánchez',
    email: 'carlos.sanchez@email.com',
    telefono: '600234567',
    rol: 'solicitante',
    fechaNacimiento: '1992-05-10',
    dni: '12345678X',
    preferContacto: 'email',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: '5',
    nombre: 'María',
    apellidos: 'Rodríguez',
    email: 'maria.rodriguez@empresa.com',
    telefono: '600345678',
    rol: 'rrhh',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: '6',
    nombre: 'Javier',
    apellidos: 'Martín',
    email: 'javier.martin@email.com',
    telefono: '600567890',
    rol: 'solicitante',
    fechaNacimiento: '1988-12-18',
    dni: '87654321Y',
    preferContacto: 'telefono',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop'
  }
];

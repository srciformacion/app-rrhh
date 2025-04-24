
// Types for our mock data
export type UserRole = 'rrhh' | 'trabajador' | 'solicitante';
export type JobType = 'publico' | 'interno';
export type ApplicationStatus = 'pendiente' | 'aprobado' | 'rechazado';
export type ContactPreference = 'email' | 'telefono' | 'ambos';

export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: UserRole;
  avatarUrl?: string;
  fechaNacimiento?: string;
  dni?: string;
  titulaciones?: string[];
  carnetsConducir?: string[];
  preferContacto?: ContactPreference;
  fechaContratacion?: string; // Solo para trabajadores
}

export interface JobPosting {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: JobType;
  grupoDestinatario: string;
  fechaInicio: string;
  fechaFin: string;
  requisitos: string[];
  createdBy: string; // ID del usuario de RRHH
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  estado: ApplicationStatus;
  fecha: string;
  motivacion?: string;
  archivosAdjuntos?: string[]; // URLs simuladas para archivos
  comentariosRRHH?: string;
}

export interface ChatMessage {
  id: string;
  emisorId: string;
  receptorId: string;
  mensaje: string;
  timestamp: string;
  leido: boolean;
  adjuntos?: string[];
}

// Mock data
export const mockUsers: User[] = [
  {
    id: '1',
    nombre: 'Ana García',
    email: 'ana.garcia@empresa.com',
    telefono: '600123456',
    rol: 'rrhh',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: '2',
    nombre: 'Pedro López',
    email: 'pedro.lopez@empresa.com',
    telefono: '600789123',
    rol: 'trabajador',
    fechaContratacion: '2020-03-15',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: '3',
    nombre: 'Laura Martínez',
    email: 'laura.martinez@empresa.com',
    telefono: '600456789',
    rol: 'trabajador',
    fechaContratacion: '2019-07-22',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: '4',
    nombre: 'Carlos Sánchez',
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
    nombre: 'María Rodríguez',
    email: 'maria.rodriguez@empresa.com',
    telefono: '600345678',
    rol: 'rrhh',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: '6',
    nombre: 'Javier Martín',
    email: 'javier.martin@email.com',
    telefono: '600567890',
    rol: 'solicitante',
    fechaNacimiento: '1988-12-18',
    dni: '87654321Y',
    preferContacto: 'telefono',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop'
  }
];

export const mockJobs: JobPosting[] = [
  {
    id: '1',
    titulo: 'Desarrollador Front-end',
    descripcion: 'Buscamos desarrollador con experiencia en React, TypeScript y CSS moderno para proyectos web.',
    tipo: 'publico',
    grupoDestinatario: 'Departamento de Tecnología',
    fechaInicio: '2024-04-01',
    fechaFin: '2024-05-15',
    requisitos: ['React', 'TypeScript', '3 años de experiencia'],
    createdBy: '1'
  },
  {
    id: '2',
    titulo: 'Analista de Datos',
    descripcion: 'Se necesita analista para procesamiento y visualización de datos empresariales.',
    tipo: 'publico',
    grupoDestinatario: 'Departamento de Business Intelligence',
    fechaInicio: '2024-04-10',
    fechaFin: '2024-05-25',
    requisitos: ['SQL', 'Power BI', 'Excel avanzado'],
    createdBy: '5'
  },
  {
    id: '3',
    titulo: 'Promoción a Jefe de Equipo',
    descripcion: 'Proceso interno para cubrir puesto de jefatura en departamento técnico.',
    tipo: 'interno',
    grupoDestinatario: 'Departamento Técnico',
    fechaInicio: '2024-04-05',
    fechaFin: '2024-04-30',
    requisitos: ['3 años en la empresa', 'Evaluación positiva'],
    createdBy: '1'
  },
  {
    id: '4',
    titulo: 'Curso Especialización Cloud',
    descripcion: 'Formación avanzada en AWS para personal técnico.',
    tipo: 'interno',
    grupoDestinatario: 'Departamento de Sistemas',
    fechaInicio: '2024-05-01',
    fechaFin: '2024-05-15',
    requisitos: ['Conocimientos básicos de cloud', 'Departamento de Sistemas'],
    createdBy: '5'
  },
  {
    id: '5',
    titulo: 'Administrativo de Recursos Humanos',
    descripcion: 'Puesto para gestión administrativa en el departamento de RRHH.',
    tipo: 'publico',
    grupoDestinatario: 'Departamento de RRHH',
    fechaInicio: '2024-04-15',
    fechaFin: '2024-05-30',
    requisitos: ['Experiencia administrativa', 'Conocimientos de legislación laboral'],
    createdBy: '1'
  }
];

export const mockApplications: Application[] = [
  {
    id: '1',
    userId: '4',
    jobId: '1',
    estado: 'pendiente',
    fecha: '2024-04-10',
    motivacion: 'Tengo amplia experiencia en desarrollo front-end y me encantaría formar parte de su empresa.',
    archivosAdjuntos: ['CV_Carlos_Sanchez.pdf', 'Portfolio_Carlos.pdf']
  },
  {
    id: '2',
    userId: '6',
    jobId: '1',
    estado: 'aprobado',
    fecha: '2024-04-08',
    motivacion: 'Mi experiencia previa en proyectos similares me permitiría aportar valor desde el primer día.',
    archivosAdjuntos: ['CV_Javier_Martin.pdf']
  },
  {
    id: '3',
    userId: '4',
    jobId: '5',
    estado: 'rechazado',
    fecha: '2024-04-18',
    comentariosRRHH: 'No cumple con los requisitos mínimos de experiencia'
  },
  {
    id: '4',
    userId: '2',
    jobId: '3',
    estado: 'aprobado',
    fecha: '2024-04-12',
    motivacion: 'Después de 4 años en la empresa, me siento preparado para asumir responsabilidades de liderazgo.'
  },
  {
    id: '5',
    userId: '3',
    jobId: '4',
    estado: 'pendiente',
    fecha: '2024-04-20',
    motivacion: 'Me gustaría ampliar mis conocimientos en cloud para aplicarlos a mis tareas diarias.'
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    emisorId: '4',
    receptorId: '1',
    mensaje: 'Buenos días, ¿podría darme más información sobre el proceso de selección?',
    timestamp: '2024-04-15T09:30:00',
    leido: true
  },
  {
    id: '2',
    emisorId: '1',
    receptorId: '4',
    mensaje: 'Claro Carlos, el proceso consta de una entrevista técnica y una prueba práctica. ¿Tienes disponibilidad la próxima semana?',
    timestamp: '2024-04-15T10:15:00',
    leido: true
  },
  {
    id: '3',
    emisorId: '4',
    receptorId: '1',
    mensaje: 'Perfecto, estoy disponible cualquier día por la mañana. ¿Qué debo preparar para la prueba?',
    timestamp: '2024-04-15T10:20:00',
    leido: true
  },
  {
    id: '4',
    emisorId: '2',
    receptorId: '5',
    mensaje: '¿Hay algún requisito adicional para la promoción a jefe de equipo?',
    timestamp: '2024-04-16T11:05:00',
    leido: false
  },
  {
    id: '5',
    emisorId: '5',
    receptorId: '2',
    mensaje: 'Necesitarás presentar un plan de gestión para el departamento y pasar una entrevista con dirección.',
    timestamp: '2024-04-16T11:30:00',
    leido: true
  },
  {
    id: '6',
    emisorId: '6',
    receptorId: '1',
    mensaje: 'He enviado mi candidatura para el puesto de desarrollo. ¿Podrían confirmarme si han recibido toda la documentación correctamente?',
    timestamp: '2024-04-18T14:20:00',
    leido: false
  },
  {
    id: '7',
    emisorId: '3',
    receptorId: '5',
    mensaje: '¿Cuál es el horario del curso de especialización en AWS?',
    timestamp: '2024-04-20T16:45:00',
    leido: true
  },
  {
    id: '8',
    emisorId: '5',
    receptorId: '3',
    mensaje: 'El curso será de 9:00 a 14:00, durante dos semanas. Te enviaremos el programa completo por email.',
    timestamp: '2024-04-21T09:10:00',
    leido: false
  }
];

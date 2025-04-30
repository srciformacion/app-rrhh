
// Types for our mock data
export type UserRole = 'rrhh' | 'trabajador' | 'solicitante';
export type JobType = 'publico' | 'interno';
export type ApplicationStatus = 'pendiente' | 'aprobado' | 'rechazado';
export type ContactPreference = 'email' | 'telefono' | 'ambos';

export interface User {
  id: string;
  nombre: string;
  apellidos?: string;
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
  ubicacion?: string;
  codigoInterno?: string;
  entidadConvocante?: string;
  pdfBase?: string;
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
  processId?: string; // Añadido para compatibilidad
  fechaPostulacion?: string; // Añadido para compatibilidad
  nombre?: string; // For compatibility with JobApplication interface
  apellidos?: string; // For compatibility with JobApplication interface
  email?: string; // For compatibility with JobApplication interface
  telefono?: string; // For compatibility with JobApplication interface
  experiencia?: string; // For compatibility with JobApplication interface
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

// Adding types that were previously in jobTypes.ts
export interface JobApplication {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  experiencia?: string;
  motivacion?: string;
  cvFile?: File | null;
  otrosDocumentos?: File[] | null;
  processId?: string;
  jobId?: string;
  userId?: string;
  fechaPostulacion?: string;
  estado?: ApplicationStatus;
  comentariosRRHH?: string;
  archivosAdjuntos?: string[];
  fecha?: string;
}

export interface NotificationMessage {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  userId?: string;
}

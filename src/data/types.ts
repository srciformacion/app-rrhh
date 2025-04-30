
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

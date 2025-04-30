
import { Application } from './types';

// Mock applications data
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


import { ChatMessage } from './types';

// Mock chat messages data
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

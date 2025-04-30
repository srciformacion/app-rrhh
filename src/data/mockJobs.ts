
import { JobPosting } from './types';

// Mock job postings data
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
    createdBy: '1',
    ubicacion: 'Madrid',
    codigoInterno: 'DEV-FE-001',
    entidadConvocante: 'Empresa S.A.',
    pdfBase: 'https://example.com/job-pdf/1.pdf'
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
    createdBy: '5',
    ubicacion: 'Barcelona',
    codigoInterno: 'BI-AD-002',
    entidadConvocante: 'Empresa S.A.',
    pdfBase: 'https://example.com/job-pdf/2.pdf'
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
    createdBy: '1',
    ubicacion: 'Madrid',
    codigoInterno: 'INT-JE-003',
    entidadConvocante: 'Departamento RRHH'
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
    createdBy: '5',
    ubicacion: 'Online',
    codigoInterno: 'FORM-AWS-004',
    entidadConvocante: 'Departamento Formación'
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
    createdBy: '1',
    ubicacion: 'Valencia',
    codigoInterno: 'ADM-RH-005',
    entidadConvocante: 'Empresa S.A.',
    pdfBase: 'https://example.com/job-pdf/5.pdf'
  }
];

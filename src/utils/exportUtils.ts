
import { JobApplication } from "@/data/jobTypes";
import { User } from "@/data/mockData";

// Función para exportar datos a CSV
export const exportToCSV = (data: any[], filename: string) => {
  // Extraer las cabeceras de la primera entrada
  const headers = Object.keys(data[0]);
  
  // Crear filas de datos
  const csvRows = [
    // Cabecera
    headers.join(','),
    
    // Filas de datos
    ...data.map(row => {
      return headers.map(header => {
        // Valor actual
        const value = row[header];
        
        // Manejar tipos de datos y formatear correctamente
        if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'string') {
          // Escapar comillas y encerrar en comillas
          return `"${value.replace(/"/g, '""')}"`;
        } else if (typeof value === 'object') {
          // Convertir objetos a JSON string
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        
        return value;
      }).join(',');
    })
  ].join('\n');
  
  // Crear el blob y descargar
  const blob = new Blob([csvRows], { type: 'text/csv' });
  downloadBlob(blob, `${filename}.csv`);
};

// Función para exportar aplicaciones con información de usuario
export const exportApplicationsToCSV = (applications: JobApplication[], users: User[], filename: string) => {
  // Crear datos enriquecidos juntando información de aplicación y usuario
  const enrichedData = applications.map(app => {
    const user = users.find(u => u.id === app.userId);
    
    return {
      ID: app.id,
      Nombre: user?.nombre || app.nombre || '',
      Apellidos: user?.apellidos || app.apellidos || '',
      Email: user?.email || app.email || '',
      Telefono: user?.telefono || app.telefono || '',
      FechaPostulacion: new Date(app.fechaPostulacion).toLocaleDateString(),
      Estado: app.estado,
      Experiencia: app.experiencia || '',
      Motivacion: app.motivacion || ''
    };
  });
  
  exportToCSV(enrichedData, filename);
};

// Función auxiliar para descargar un Blob
const downloadBlob = (blob: Blob, filename: string) => {
  // Crear URL del blob
  const url = URL.createObjectURL(blob);
  
  // Crear link temporal y simular clic
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Limpiar
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};

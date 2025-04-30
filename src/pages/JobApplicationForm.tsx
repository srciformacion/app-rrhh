import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MainLayout } from "@/components/Layout/MainLayout";
import { jobService } from "@/services/jobService";
import { applicationService } from "@/services/jobService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/UI/LoadingSpinner";
import { Briefcase, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const applicationFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  apellidos: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres."),
  email: z.string().email("Correo electrónico inválido."),
  telefono: z.string().min(9, "El teléfono debe tener al menos 9 dígitos."),
  experiencia: z.string()
    .min(50, "Debe ingresar al menos 50 caracteres.")
    .max(1000, "No debe exceder los 1000 caracteres."),
  motivacion: z.string()
    .min(50, "Debe ingresar al menos 50 caracteres.")
    .max(500, "No debe exceder los 500 caracteres."),
});

export default function JobApplicationForm() {
  const { processId } = useParams<{ processId: string }>();
  const { isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  // Cargar los datos del proceso
  const process = processId ? jobService.getJobById(processId) : null;
  
  const form = useForm<z.infer<typeof applicationFormSchema>>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      nombre: currentUser?.nombre || "",
      apellidos: currentUser?.apellidos || "",
      email: currentUser?.email || "",
      telefono: "",
      experiencia: "",
      motivacion: "",
    },
  });

  // Verificar si el proceso existe y si la persona puede aplicar
  if (!process) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-3">Proceso no encontrado</h2>
          <p className="text-gray-500 mb-6">El proceso al que intentas aplicar no existe o no está disponible</p>
          <Link to="/procesos">
            <Button>Volver a procesos</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const isActive = () => {
    const now = new Date().toISOString().split('T')[0];
    return process.fechaInicio <= now && process.fechaFin >= now;
  };
  
  const canApply = () => {
    // If not authenticated, can't apply
    if (!isAuthenticated) return false;
    
    // If process is not active, can't apply
    if (!isActive()) return false;
    
    // If public process, anyone can apply
    if (process.tipo === 'publico') return true;
    
    // If internal process, only workers can apply
    return currentUser?.rol === 'trabajador';
  };
  
  // Verificar si la persona puede aplicar
  if (!canApply()) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-3">No puedes aplicar a este proceso</h2>
          {!isAuthenticated ? (
            <>
              <p className="text-gray-500 mb-6">Debes iniciar sesión para postular a este proceso</p>
              <Link to="/login">
                <Button>Iniciar sesión</Button>
              </Link>
            </>
          ) : !isActive() ? (
            <>
              <p className="text-gray-500 mb-6">Este proceso ya no está activo</p>
              <Link to="/procesos">
                <Button>Ver otros procesos</Button>
              </Link>
            </>
          ) : process.tipo === 'interno' && currentUser?.rol !== 'trabajador' ? (
            <>
              <p className="text-gray-500 mb-6">Este es un proceso interno solo para empleados activos</p>
              <Link to="/procesos">
                <Button>Ver otros procesos</Button>
              </Link>
            </>
          ) : (
            <p className="text-gray-500 mb-6">No cumples con los requisitos para aplicar a este proceso</p>
          )}
        </div>
      </MainLayout>
    );
  }
  
  async function onSubmit(data: z.infer<typeof applicationFormSchema>) {
    setSubmitting(true);
    
    try {
      // Enviar la postulación
      await applicationService.submitJobApplication({
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        experiencia: data.experiencia,
        motivacion: data.motivacion,
        processId: processId || "",
        userId: currentUser?.id,
      });
      
      // Mostrar mensaje de éxito
      toast({
        title: "¡Postulación enviada con éxito!",
        description: "Hemos recibido tu postulación y la revisaremos en breve.",
        variant: "default",
      });
      
      // Redirigir a la página de postulaciones
      navigate("/portal-empleo/mis-postulaciones");
    } catch (error) {
      console.error("Error al enviar la postulación:", error);
      toast({
        title: "Error al enviar la postulación",
        description: "Ha ocurrido un error al enviar tu postulación. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }
  
  if (submitting) {
    return <LoadingSpinner />;
  }
  
  return (
    <MainLayout>
      <div className="mb-4">
        <Link to={`/procesos/${processId}`} className="text-hrm-blue hover:underline text-sm">
          &larr; Volver al detalle del proceso
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Postular a proceso</h1>
        <p className="text-gray-500">Completa el siguiente formulario para postular al proceso seleccionado</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Formulario de postulación</CardTitle>
              <CardDescription>Completa todos los campos requeridos para enviar tu postulación</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="apellidos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellidos</FormLabel>
                          <FormControl>
                            <Input placeholder="Tus apellidos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="tu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="telefono"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu número de teléfono" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <FormField
                    control={form.control}
                    name="experiencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experiencia relevante</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe tu experiencia relacionada con este puesto..." 
                            className="min-h-[150px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Detalla tu experiencia laboral relevante para este puesto (mínimo 50 caracteres).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="motivacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carta de motivación</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Explica por qué quieres este puesto y por qué eres un buen candidato..." 
                            className="min-h-[150px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Explica por qué estás interesado/a en este puesto y por qué deberías ser seleccionado/a (mínimo 50 caracteres).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Enviando..." : "Enviar postulación"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen del proceso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{process.titulo}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={process.tipo === "publico" ? "default" : "secondary"}>
                      {process.tipo === "publico" ? "Proceso público" : "Proceso interno"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>{process.grupoDestinatario}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Publicado: {new Date(process.fechaInicio).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Cierre: {new Date(process.fechaFin).toLocaleDateString()}</span>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Requisitos principales:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {process.requisitos.slice(0, 3).map((req, index) => (
                      <li key={index} className="text-sm text-gray-600">{req}</li>
                    ))}
                    {process.requisitos.length > 3 && (
                      <li className="text-sm text-gray-600">
                        <Link to={`/procesos/${processId}`} className="text-blue-600 hover:underline">
                          Ver todos los requisitos...
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                Al enviar tu postulación, aceptas que tus datos sean procesados para el proceso de selección.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

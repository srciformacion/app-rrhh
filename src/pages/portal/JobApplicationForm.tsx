
import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { jobService, applicationService } from "@/services/jobService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

const applicationFormSchema = z.object({
  motivacion: z.string().min(10, {
    message: "La carta de motivación debe tener al menos 10 caracteres.",
  }),
  cvFile: z.string().optional(),
  additionalFiles: z.array(z.string()).optional(),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export default function JobApplicationForm() {
  const { jobId } = useParams<{ jobId: string }>();
  const { isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      motivacion: "",
      cvFile: undefined,
      additionalFiles: [],
    },
  });
  
  if (!jobId || !isAuthenticated || !currentUser) {
    navigate("/login");
    return null;
  }
  
  const job = jobService.getJobById(jobId);
  
  if (!job) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-3">Oferta no encontrada</h2>
          <p className="text-gray-500 mb-6">La oferta que buscas no existe o no está disponible</p>
          <Link to="/portal-empleo">
            <Button>Volver a ofertas</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  const isJobActive = () => {
    const now = new Date().toISOString().split('T')[0];
    return job.fechaInicio <= now && job.fechaFin >= now;
  };
  
  const canApply = () => {
    if (!isJobActive()) return false;
    
    // If public job, anyone can apply
    if (job.tipo === 'publico') return true;
    
    // If internal job, only workers can apply
    return currentUser?.rol === 'trabajador';
  };
  
  if (!canApply()) {
    navigate("/portal-empleo");
    return null;
  }
  
  // Check if user already applied
  const existingApplications = applicationService.getApplicationsByUserId(currentUser.id);
  const alreadyApplied = existingApplications.some(app => app.jobId === jobId);
  
  const onSubmit = (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    
    // Simulate upload delay
    setTimeout(() => {
      try {
        const newApplication = applicationService.createApplication({
          userId: currentUser.id,
          jobId,
          estado: 'pendiente',
          fecha: new Date().toISOString().split('T')[0],
          motivacion: data.motivacion,
          archivosAdjuntos: data.additionalFiles,
        });
        
        toast({
          title: "Postulación enviada",
          description: "Tu solicitud ha sido enviada correctamente. Puedes consultar su estado en tu perfil.",
        });
        
        navigate("/portal-empleo/mis-postulaciones");
      } catch (error) {
        toast({
          title: "Error al enviar postulación",
          description: "Ha ocurrido un error al enviar tu solicitud. Inténtalo de nuevo más tarde.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };
  
  if (alreadyApplied) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <h2 className="text-2xl font-bold mb-3">Ya has postulado a esta oferta</h2>
          <p className="text-gray-500 mb-6">Ya tienes una solicitud enviada para esta oferta de trabajo</p>
          <div className="flex justify-center gap-4">
            <Link to="/portal-empleo">
              <Button variant="outline">Ver otras ofertas</Button>
            </Link>
            <Link to="/portal-empleo/mis-postulaciones">
              <Button>Ver mis postulaciones</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="mb-4">
        <Link to={`/portal-empleo/oferta/${jobId}`} className="text-hrm-blue hover:underline text-sm">
          &larr; Volver a la oferta
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Postular a {job.titulo}</h1>
        <p className="text-gray-500 mt-1">Completa el formulario para enviar tu candidatura</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Formulario de solicitud</CardTitle>
            <CardDescription>
              Completa toda la información requerida para postularte a esta oferta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="motivacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carta de motivación</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explícanos por qué te interesa esta posición y por qué deberíamos considerarte..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explica brevemente por qué estás interesado/a en esta oferta y cómo tus habilidades se alinean con el puesto.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Documentación</h3>
                  <Separator className="mb-6" />
                  
                  <FormField
                    control={form.control}
                    name="cvFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currículum Vitae</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(file.name);
                                }
                              }}
                            />
                            {field.value && (
                              <Button
                                variant="ghost"
                                type="button"
                                onClick={() => field.onChange(undefined)}
                              >
                                Eliminar
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Adjunta tu CV actualizado en formato PDF o Word.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-6">
                    <FormLabel>Documentos adicionales</FormLabel>
                    <FormDescription className="mb-2">
                      Puedes adjuntar documentos adicionales como certificados, titulaciones o carnet de conducir.
                    </FormDescription>
                    
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const fileNames = files.map(file => file.name);
                        form.setValue("additionalFiles", fileNames);
                      }}
                      className="mb-2"
                    />
                    
                    {form.watch("additionalFiles")?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-medium">Archivos seleccionados:</p>
                        <ul className="text-sm text-gray-500">
                          {form.watch("additionalFiles")?.map((file, index) => (
                            <li key={index}>{file}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar postulación"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de la oferta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-medium">Puesto</h3>
                  <p>{job.titulo}</p>
                </div>
                <div>
                  <h3 className="font-medium">Departamento</h3>
                  <p>{job.grupoDestinatario}</p>
                </div>
                <div>
                  <h3 className="font-medium">Fecha límite</h3>
                  <p>{new Date(job.fechaFin).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tus datos de contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-medium">Nombre completo</h3>
                  <p>{currentUser.nombre}</p>
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p>{currentUser.email}</p>
                </div>
                <div>
                  <h3 className="font-medium">Teléfono</h3>
                  <p>{currentUser.telefono || "No especificado"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">
                Al enviar tu solicitud, aceptas que procesemos tus datos personales para este proceso de selección de acuerdo con nuestra política de privacidad.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

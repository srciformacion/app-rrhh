
import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "@/components/UI/Redirect";
import { useNavigate } from "react-router-dom";
import { jobService } from "@/services/jobService";
import { JobType } from "@/data/mockData";
import { format } from "date-fns";
import { FilePlus, Calendar, MapPin, Briefcase, FileText, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Define the form schema using Zod
const processFormSchema = z.object({
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  codigoInterno: z.string().min(2, "El código debe tener al menos 2 caracteres"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  tipo: z.enum(["publico", "interno"]),
  grupoDestinatario: z.string().min(2, "Especifique el grupo destinatario"),
  fechaInicio: z.date({
    required_error: "Seleccione fecha de inicio",
  }),
  fechaFin: z.date({
    required_error: "Seleccione fecha de fin",
  }),
  requisitos: z.string().min(3, "Especifique al menos un requisito"),
  estado: z.enum(["borrador", "publicado", "cerrado"]).default("borrador"),
  localizacion: z.string().min(2, "Especifique la localización"),
  puesto: z.string().min(2, "Especifique el puesto ofertado"),
});

type ProcessFormValues = z.infer<typeof processFormSchema>;

export default function ProcessForm() {
  const { hasRole, currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Initialize form with default values
  const form = useForm<ProcessFormValues>({
    resolver: zodResolver(processFormSchema),
    defaultValues: {
      titulo: "",
      codigoInterno: "",
      descripcion: "",
      tipo: "publico",
      grupoDestinatario: "",
      requisitos: "",
      estado: "borrador",
      localizacion: "",
      puesto: "",
    },
  });

  if (!hasRole("rrhh")) {
    return <Redirect to="/login" />;
  }

  const onSubmit = (values: ProcessFormValues) => {
    try {
      // Format to match the JobPosting type
      const newProcess = {
        titulo: values.titulo,
        descripcion: values.descripcion,
        tipo: values.tipo as JobType,
        grupoDestinatario: values.grupoDestinatario,
        fechaInicio: values.fechaInicio.toISOString().split("T")[0],
        fechaFin: values.fechaFin.toISOString().split("T")[0],
        requisitos: values.requisitos.split("\n").filter(req => req.trim() !== ""),
        createdBy: currentUser?.id || "",
        // Additional fields not in the original JobPosting model
        codigoInterno: values.codigoInterno,
        estado: values.estado,
        localizacion: values.localizacion,
        puesto: values.puesto,
        // We would handle PDF upload here in a real application
      };

      // For demo, use the existing service (this would need enhancement for the new fields)
      jobService.createJob(newProcess);
      
      toast({
        title: "Proceso creado",
        description: "El proceso ha sido creado con éxito",
      });
      
      navigate("/rrhh/procesos");
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear el proceso",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Error",
          description: "Por favor sube un archivo PDF",
          variant: "destructive",
        });
        return;
      }
      setPdfFile(file);
    }
  };

  const uploadFile = async () => {
    if (!pdfFile) return;
    
    setIsUploading(true);
    // In a real application, this would upload to a server/cloud storage
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Archivo subido",
        description: "El PDF ha sido subido correctamente",
      });
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <FilePlus className="mr-2 h-8 w-8" />
            Crear nuevo proceso
          </h1>
          <p className="text-gray-500 mt-1">
            Complete todos los campos para crear un nuevo proceso de selección
          </p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Información básica del proceso</CardTitle>
          <CardDescription>
            Introduzca los datos principales del proceso de selección
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del proceso *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Selección Técnico Informática" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="codigoInterno"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código interno *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: PROC-2024-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de proceso *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="publico">Público</SelectItem>
                          <SelectItem value="interno">Interno</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="borrador">Borrador</SelectItem>
                          <SelectItem value="publicado">Publicado</SelectItem>
                          <SelectItem value="cerrado">Cerrado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fechaInicio"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de inicio *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fechaFin"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de fin *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="localizacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localización / Entidad convocante *</FormLabel>
                      <div className="flex gap-2 items-center">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input placeholder="Ej: Departamento Central, Madrid" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="puesto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Puesto ofertado *</FormLabel>
                      <div className="flex gap-2 items-center">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input placeholder="Ej: Técnico de Sistemas" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grupoDestinatario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo destinatario *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Departamento de Tecnología" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del proceso *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describa el proceso de selección, objetivos y detalles relevantes"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requisitos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requisitos *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Introduzca cada requisito en una línea nueva"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  PDF con las bases del proceso
                </h3>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="mb-2"
                  />
                  {pdfFile && (
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{pdfFile.name}</span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={uploadFile}
                        disabled={isUploading}
                      >
                        <Upload className="mr-1 h-4 w-4" />
                        {isUploading ? "Subiendo..." : "Subir"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <CardFooter className="flex justify-between border-t pt-6 mt-6 px-0">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate("/rrhh/procesos")}
                >
                  Cancelar
                </Button>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    onClick={() => form.setValue("estado", "borrador")}
                  >
                    Guardar como borrador
                  </Button>
                  <Button 
                    type="submit"
                    onClick={() => form.setValue("estado", "publicado")}
                  >
                    Publicar proceso
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

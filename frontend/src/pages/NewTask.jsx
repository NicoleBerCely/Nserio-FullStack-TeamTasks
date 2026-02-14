import { useState, useEffect } from "react";
import { toast } from 'sonner';
import {
  Briefcase,
  User, Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getDevelopers } from "../services/developersController/developer.service";
import { postTasks } from "../services/taskscontroller/tasks.service";
import { getProjects } from "../services/projectsController/projects.service";

export default function NewTaskModal({ projectId, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [developers, setDevelopers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [devs, projs] = await Promise.all([getDevelopers(), getProjects()]);
          setDevelopers(devs.content || []);
          setProjects(projs.content || []);
        } catch (err) {
          toast.error("Error al cargar los datos del formulario");
        }
      };
      fetchData();
    }
  }, [open]);

  const initialForm = {
    projectId: projectId ? Number(projectId) : "",
    title: "",
    description: "",
    assigneeId: "",
    status: "ToDo",
    priority: "low",
    estimatedComplexity: 1,
    dueDate: ""
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    // Lógica para números y límites
    if (name === 'assigneeId' || name === 'projectId') {
      val = value === "" ? "" : Number(value);
    }

    if (name === 'estimatedComplexity') {
      val = Number(value);
      // Validación manual por si el usuario escribe un número mayor a 5
      if (val > 5) val = 5;
      if (val < 1 && value !== "") val = 1;
    }

    setForm({ ...form, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const respuesta = await postTasks(form);

      if (respuesta.success) {
        toast.success('¡Tarea creada con éxito!');
        setOpen(false);
        setForm(initialForm);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      const mensajeError = error.response?.data?.content || 'Hubo un error inesperado al guardar';

      toast.error(mensajeError);
      console.error("Detalle técnico:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-5 bg-slate-900 hover:bg-black text-white shadow-xl transition-all hover:scale-105 active:scale-95">
          <span className="mr-2 font-bold">+</span> Nueva Tarea
        </Button>
      </DialogTrigger>

      {/* Reducimos el max-width a 520px para que se note más que es un modal */}
      <DialogContent className="p-0 gap-0 overflow-hidden sm:max-w-[520px] border-none shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] rounded-[2rem] max-h-[95vh] flex flex-col">
        {/* Header más compacto y elegante */}
        <div className="bg-[#1a1f2e] px-8 py-6 text-white shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
              Crear Nueva Tarea
            </DialogTitle>
            <p className="text-slate-400 text-xs mt-1">Gestiona el progreso de tu equipo.</p>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5 bg-white overflow-y-auto flex-1 custom-scrollbar">

          {/* Fila 1: Contexto */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 ml-1">
                <Briefcase className="w-3 h-3 text-indigo-500" /> Proyecto
              </Label>
              <Select
                disabled={!!projectId}
                onValueChange={(v) => handleChange({ target: { name: "projectId", value: v } })}
                value={form.projectId?.toString()}
              >
                <SelectTrigger className="h-12 border-slate-200 bg-slate-50/30 rounded-xl focus:ring-indigo-500">
                  <SelectValue placeholder="Proyecto" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {projects.map((p) => (
                    <SelectItem key={p.projectId} value={p.projectId.toString()} className="rounded-lg my-1">
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-slate-800 leading-none mb-1">{p.clientName}</span>
                        <span className="text-[10px] text-indigo-500 font-medium">{p.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 ml-1">
                <User className="w-3 h-3 text-indigo-500" /> Asignado a
              </Label>
              <Select
                onValueChange={(v) => handleChange({ target: { name: "assigneeId", value: v } })}
                value={form.assigneeId?.toString()}
              >
                <SelectTrigger className="h-12 border-slate-200 bg-slate-50/30 rounded-xl">
                  <SelectValue placeholder="Ejecutor" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {developers.map((d) => (
                    <SelectItem key={d.developerId} value={d.developerId.toString()} className="rounded-lg">
                      <span className="text-sm font-medium text-slate-700">{d.fullName}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fila 2: Título */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider ml-1">Título</Label>
            <Input
              name="title"
              required
              onChange={handleChange}
              className="h-11 border-slate-200 rounded-xl placeholder:text-slate-300 focus:border-indigo-500 transition-all"
              placeholder="Ej: Ajustar API de pagos"
            />
          </div>
          {/* Fila 3: Descripción */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider ml-1">Descripción</Label>
            <Textarea
              name="description"
              onChange={handleChange}
              className="min-h-[80px] border-slate-200 rounded-xl text-sm transition-all focus:border-indigo-500"
              placeholder="Detalles adicionales..."
            />
          </div>
          {/* Fila 4: Configuración Rápida (Estilizada en una caja) */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <Label className="text-[10px] font-bold text-slate-400 uppercase">Estado</Label>
              <select name="status" onChange={handleChange} value={form.status} className="w-full bg-transparent border-none text-sm font-semibold focus:ring-0 outline-none cursor-pointer">
                <option value="ToDo">ToDo</option>
                <option value="InProgress">InProgress</option>
                <option value="Blocked">Blocked</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="w-[1px] h-8 bg-slate-200" />
            <div className="flex-1 space-y-1">
              <Label className="text-[10px] font-bold text-slate-400 uppercase">Prioridad</Label>
              <select name="priority" onChange={handleChange} value={form.priority} className="w-full bg-transparent border-none text-sm font-semibold focus:ring-0 outline-none cursor-pointer">
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high 🔥</option>
              </select>
            </div>
            <div className="w-[1px] h-8 bg-slate-200" />
            <div className="flex-1 space-y-1">
              <Label className="text-[10px] font-bold text-slate-400 uppercase text-center">Complejidad estimada</Label>
              <input
                name="estimatedComplexity"
                type="number"
                min="1"
                max="5"
                value={form.estimatedComplexity}
                onChange={handleChange}
                className="w-full bg-transparent border-none text-sm font-semibold text-center focus:ring-0 outline-none"
                placeholder="1"
              />            </div>
          </div>

          {/* Fila 5: Fechas compactas */}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 ml-1">
                <Calendar className="w-3 h-3" /> Fecha de vencimiento
              </Label>
              <Input name="dueDate" type="date" onChange={handleChange} className="h-10 border-slate-200 rounded-xl text-xs" />
            </div>
          </div>
          {/* Botones de acción ajustados */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-slate-400 text-sm hover:bg-slate-50 rounded-xl">
              Cancelar
            </Button>
            <div className="w-full sm:w-auto">
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? "..." : "Crear Tarea"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
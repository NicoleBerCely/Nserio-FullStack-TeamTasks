import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import DataTable from "../components/Table/DataTable";
import { getProjectsTask } from "../services/projectsController/projects.service";
import NewTaskModal from "./NewTask";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { getDevelopers } from "../services/developersController/developer.service";
import { toast } from 'sonner';
export default function ProjectTasks() {
  //*--Ruta de Hooks 
  //*---ID del proyecto obtenido de la URL
  const { Id } = useParams();
  //*--- Estados Locales
  const [selectedTask, setSelectedTask] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroDeveloper, setFiltroDeveloper] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [refreshSignal, setRefreshSignal] = useState(0);
  useEffect(() => {
    const loadDevs = async () => {
      try {
        const res = await getDevelopers();
        setDevelopers(res.content || []);
      } catch (err) {
        toast.error("Error cargando desarrolladores", err);
      }
    };
    loadDevs();
  }, []);
  /**
   * Memoriza la función de petición para evitar re-renders infinitos en useFetch.
   * Se dispara cada vez que cambian los filtros o el ID del proyecto.
   */
  const fetchFn = useCallback(() => {
    if (!Id) return Promise.resolve(null);
    return getProjectsTask(Id, {
      status: filtroEstado,
      developer: filtroDeveloper,
      _v: refreshSignal
    });
  }, [Id, filtroEstado, filtroDeveloper, refreshSignal]);

  //*Hook personalizado para el manejo de peticiones HTTP
  const { data, loading, error, refetch } = useFetch(fetchFn);

  /**
   * Manejador de cambios para los inputs de filtrado.
   * Actualiza el estado correspondiente según el 'name' del input.
   */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'estado') setFiltroEstado(value);
    if (name === 'developer') setFiltroDeveloper(value);
  };
  /**
     * Configuración de columnas para DataTable.
     * Se usa useMemo para evitar que las columnas se recalculen en cada renderizado.
     */
  const columns = useMemo(() => [
    { header: "Título", accessorKey: "title" },
    {
      header: "Asignado a", accessorKey: "firstName",
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      header: "Estado", accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue();
        const colors = {
          'Completed': 'bg-green-100 text-green-700',
          'InProgress': 'bg-blue-100 text-blue-700',
          'ToDo': 'bg-slate-100 text-slate-700',
          'Blocked': 'bg-slate-100 text-slate-700'
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-slate-100'}`}>
            {status}
          </span>
        );
      }
    },
    { header: "Prioridad", accessorKey: "priority" },
    { header: "Complejidad", accessorKey: "estimatedComplexity" },
    { header: "Fecha de creación", accessorKey: "createdAt", cell: info => info.getValue()?.split('T')[0] },
    { header: "Fecha de vencimiento", accessorKey: "dueDate", cell: info => info.getValue()?.split('T')[0] },
  ], []);
  /**
     * Lógica de procesamiento de datos:
     * 1. Valida que existan datos.
     * 2. Filtra localmente las tareas por estado y desarrollador (case-insensitive).
     */
  const tasks = useMemo(() => {
    if (!data) return [];
    const content = data?.content || data;
    if (!Array.isArray(content)) return [];
    return content.filter(task => {
      const cumpleEstado = filtroEstado === '' || task.status === filtroEstado;
      const fullName = `${task.firstName} ${task.lastName}`.toLowerCase();
      const cumpleDev = filtroDeveloper === '' || fullName.includes(filtroDeveloper.toLowerCase());
      return cumpleEstado && cumpleDev;
    });
  }, [data, filtroEstado, filtroDeveloper]);
  /**
   * Logica para ver el Grafico
   */
  const chartData = useMemo(() => {
    if (!data) return [];
    const content = data?.content || data;
    if (!Array.isArray(content)) return [];

    const counts = content.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map(status => ({
      name: status,
      value: counts[status]
    }));
  }, [data]);

  const COLORS = {
    'Completed': '#22c55e', // green-500
    'InProgress': '#3b82f6', // blue-500
    'ToDo': '#94a3b8',      // slate-400
  };
  if (error) return <div className="p-10 text-center text-red-500 font-medium">Error al cargar tareas</div>;

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans overflow-hidden">

      {/* HEADER ORIGINAL: Con Link y Titulo/Modal alineados */}
      <div className="space-y-2">
        <Link to="/" className="text-blue-600 hover:underline text-sm font-medium transition-colors">
          ← Volver al Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Tareas del Proyecto #{Id}
          </h1>
          {/* BOTÓN ORIGINAL (MODAL) */}
          <div className="flex justify-end">
            <NewTaskModal projectId={Id} onSuccess={() => {setRefreshSignal(prev => prev + 1);
            }} />
          </div>
        </div>
      </div>
      {/*SECCION DE GRAFICO*/}
      {!loading && chartData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Resumen de Estados</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#cbd5e1'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Opcional: Tarjetas de métricas rápidas */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {chartData.map(stat => (
              <div key={stat.name} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
                <span className="text-2xl font-black text-slate-800">{stat.value}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{stat.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* SECCIÓN DE TABLA */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">

        {/* FILTROS ORIGINALES (Selects con nombres) */}
        <div className="flex flex-wrap items-center justify-end gap-3 p-4 border-b border-slate-100 bg-slate-50/30">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">
            Filtrar por:
          </span>

          <select
            name="estado"
            value={filtroEstado}
            onChange={handleFilterChange}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">Todos los Estados</option>
            <option value="ToDo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            name="developer"
            value={filtroDeveloper}
            onChange={handleFilterChange}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">Todos los Desarrolladores</option>
            {developers.map((dev) => (
              <option key={dev.developerId} value={dev.fullName}>
                {dev.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* TABLA: Con scroll interno únicamente */}
        <div className="p-4 overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center text-slate-400 animate-pulse font-medium">Cargando tareas...</div>
          ) : (
            <DataTable
              columns={columns}
              data={tasks}
              onRowClick={(row) => setSelectedTask(row.original)}
              rowClassName={() => "hover:bg-slate-50 cursor-pointer transition-colors"}
            />
          )}
        </div>
      </section>

      {/* PANEL LATERAL (Overlay) */}
      {selectedTask && (
        <>
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedTask(null)} />
          <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">Detalle de la Tarea</h2>
              <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400">✕</button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Título</label>
                <p className="text-lg font-semibold text-slate-900 leading-tight">{selectedTask.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Estado</label>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold uppercase">{selectedTask.status}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Prioridad</label>
                  <p className="text-sm font-bold text-slate-800">{selectedTask.priority}</p>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Asignado a</label>
                <p className="text-slate-700 font-medium">{selectedTask.firstName} {selectedTask.lastName}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Descripción</label>
                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl italic border border-slate-100">
                  {selectedTask.description || 'Sin descripción disponible.'}
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-between text-[11px] text-slate-400 font-medium italic">
                <span>📅 Creado: {selectedTask.createdAt?.split('T')[0]}</span>
                <span>⏳ Vencimiento: {selectedTask.dueDate?.split('T')[0]}</span>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
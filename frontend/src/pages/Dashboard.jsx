import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/Table/DataTable';
import {
  getDeveloperDelayRisk,
  getDeveloperWorkload,
  getProjectHealth
} from '../services/dashboardController/dashboard.service';
import NewTaskModal from './NewTask';

const Dashboard = () => {
  const navigate = useNavigate();
  const [developerData, setDeveloperData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [developerDelay, setDeveloperDelay] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Función para refrescar todos los datos (se pasa al Modal)
  const refetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [workload, health, delay] = await Promise.all([
        getDeveloperWorkload(),
        getProjectHealth(),
        getDeveloperDelayRisk()
      ]);
      setDeveloperData(workload.content || []);
      setProjectData(health.content || []);
      setDeveloperDelay(delay.content || []);
    } catch (error) {
      console.error("Error al refrescar el dashboard", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  // --- COLUMNAS ---
  const workloadColumns = useMemo(() => [
    { header: 'Desarrollador', accessorKey: 'developerName', enableSorting: true },
    { header: 'Tareas abiertas', accessorKey: 'openTasksCount', enableSorting: true },
    {
      header: 'Complejidad Promedio', 
      accessorKey: 'averageEstimatedComplexity',
      cell: info => <span className="font-mono">{info.getValue()?.toFixed(2) ?? '0.00'}</span>
    },
  ], []);

  const projectColumns = useMemo(() => [
    { header: 'Proyecto', accessorKey: 'projectName' },
    { header: 'Cliente', accessorKey: 'clientName' },
    { header: 'Total', accessorKey: 'totalTasks' },
    { header: 'Abiertas', accessorKey: 'openTasks' },
    { header: 'Hechas', accessorKey: 'completedTasks' },
  ], []);

  const delayColumns = useMemo(() => [
    { header: 'Desarrollador', accessorKey: 'developerName' },
    { header: 'Pendientes', accessorKey: 'openTasksCount' },
    { header: 'Retraso (Días)', accessorKey: 'avGDelayDays' },
    { 
      header: 'Próximo Venc.', 
      accessorKey: 'nearestDueDate', 
      cell: info => info.getValue()?.split('T')[0] ?? '-' 
    },
    {
      header: 'Riesgo', 
      accessorKey: 'highRiskFlag',
      cell: info => info.getValue() === 1 
        ? <span className="text-red-600 font-bold px-2 py-1 bg-red-100 rounded text-xs">⚠️ ALTO</span> 
        : <span className="text-green-600">Normal</span>
    },
  ], []);

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen space-y-8">
      {/* HEADER RESPONSIVE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm">Resumen operativo y análisis de riesgos</p>
        </div>
        
        {/* El Modal ya es responsive por dentro, aquí solo lo posicionamos */}
        <div className="w-full sm:w-auto">
          <NewTaskModal onSuccess={refetchAll} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Tabla 1: Carga */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Carga por desarrollador
          </h2>
          <div className="overflow-x-auto"> {/* Contenedor para scroll móvil */}
            <DataTable columns={workloadColumns} data={developerData} />
          </div>
        </section>

        {/* Tabla 2: Salud del Proyecto + Navegación */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Estado por proyecto
          </h2>
          <div className="overflow-x-auto">
            <DataTable
              columns={projectColumns}
              data={projectData}
              onRowClick={(row) => {
                const id = row.original ? row.original.projectId : row.projectId;
                navigate(`/projects/${id}`);
              }}
              rowClassName={(row) =>
                `cursor-pointer transition-all duration-200 ${
                  row.openTasks > row.completedTasks
                  ? 'bg-red-50/50 hover:bg-red-100/80'
                  : 'hover:bg-slate-50'
                }`
              }
            />
          </div>
          <p className="mt-2 text-xs text-slate-400 italic">* Haz clic en una fila para ver el detalle de tareas.</p>
        </section>

        {/* Tabla 3: Riesgos */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            Riesgo de retraso por desarrollador
          </h2>
          <div className="overflow-x-auto">
            <DataTable
              columns={delayColumns}
              data={developerDelay}
              rowClassName={(row) =>
                `transition-colors ${
                  row.highRiskFlag === 1
                  ? 'bg-orange-50 hover:bg-orange-100'
                  : 'hover:bg-slate-50'
                }`
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
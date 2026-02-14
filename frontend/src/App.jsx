import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProjectTasks from "./pages/ProjectTasks";
import NewTask from "./pages/NewTask";
import { Toaster } from 'sonner';


function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="bottom-right" closeButton />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects/:Id" element={<ProjectTasks />} />
        <Route path="/tasks/new" element={<NewTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

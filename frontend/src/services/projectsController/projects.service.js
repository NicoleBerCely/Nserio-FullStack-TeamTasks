import { axionsInstanceBearer } from "../Instances";

export const getProjects = async () => {
    const response = await axionsInstanceBearer.get(`/api/projects`);
    return response.data;
};
export const getProjectsTask = async (Id) =>{
  const response = await axionsInstanceBearer.get(`/api/projects/${Id}/tasks`);
  return response.data;
}


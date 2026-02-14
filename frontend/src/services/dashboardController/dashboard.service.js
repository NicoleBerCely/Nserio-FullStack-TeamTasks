import { axionsInstanceBearer } from "../Instances";

export const getDeveloperWorkload = async () => {
    const response = await axionsInstanceBearer.get(`/api/dashboard/developer-workload`);
    return response.data;
};

export const getProjectHealth = async () => {
    const response = await axionsInstanceBearer.get(`/api/dashboard/project-health`);
    return response.data;
};

export const getDeveloperDelayRisk = async () => {
    const response = await axionsInstanceBearer.get(`/api/dashboard/developer-delay-risk`);
    return response.data;
};

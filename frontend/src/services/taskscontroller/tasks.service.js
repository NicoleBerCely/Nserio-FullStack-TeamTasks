import { axionsInstanceBearer } from "../Instances";

export const postTasks = async (data) => {
    const response = await axionsInstanceBearer.post(`/api/tasks`,data);
    return response.data;
};


export const updateTasks = async (data) => {
    const response = await axionsInstanceBearer.update(`/api/tasks`,data);
    return response.data;
};
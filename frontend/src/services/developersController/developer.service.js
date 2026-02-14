import { axionsInstanceBearer } from "../Instances";

export const getDevelopers = async () => {
    const response = await axionsInstanceBearer.get(`/api/developers`);
    return response.data;
};
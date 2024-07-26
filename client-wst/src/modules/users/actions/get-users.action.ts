import { wstApi } from "@/api/wstApi";
import type { User } from "../interfaces/users.interface";

export const getUsersAction = async () => {
    try {
        const { data } = await wstApi.get<User[]>('/users')
        
        return data
    } catch (error) {
        console.log(error);
        throw new Error('Error getting Users')
        
    }
}
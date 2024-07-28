import { wstApi } from "@/api/wstApi"
import type { Category } from "../interfaces/category.interface";

export const getCategoriesAction = async () => {
    try {
        const { data } = await wstApi.get<Category[]>(`/categories`)
        
        return data
    } catch (error) {
        console.log(error);
        
        throw new Error('Error getting Categories')
    }
}

import { wstApi } from "@/api/wstApi"
import type { CategoryByID } from "../interfaces/category-by-id.interface";

export const getCategoriesBookByIdAction = async (categoryId: string, page: number = 1, limit: number = 6) => {
    try {
        const { data } = await wstApi.get<CategoryByID[]>(`/categories/${categoryId}/books?limit=${limit}&offset=${(page - 1) * limit}`)
        
        return data
    } catch (error) {
        console.log(error);
        
        throw new Error('Error getting Categories')
    }
}

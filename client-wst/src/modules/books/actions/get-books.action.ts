import { wstApi } from "@/api/wstApi"
import type { Book } from "../interfaces/books.interface";

export const getBooksAction = async (page: number = 1, limit: number = 9) => {
    try {
        const { data } = await wstApi.get<Book[]>(`/books?limit=${limit}&offset=${(page - 1) * limit}`)
        

        return data
    } catch (error) {
        console.log(error);
        
        throw new Error('Error getting Books')
    }
}

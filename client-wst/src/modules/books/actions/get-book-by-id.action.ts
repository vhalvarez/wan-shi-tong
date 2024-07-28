import { wstApi } from "@/api/wstApi"
import type { Book } from "../interfaces/books.interface";

export const getBookByIdAction = async ( bookId: string) => {
    try {
        const { data } = await wstApi.get<Book>(`/books/${bookId}`)
        
        return data
    } catch (error) {
        console.log(error);
        
        throw new Error(`Error getting Book by Id ${bookId}`)
    }
}

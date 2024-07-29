import { wstApi } from '@/api/wstApi'
import type { UserByID } from '../interfaces/userbyid.interface'

export const getUserByIdAction = async (userId: string) => {
    try {
        const { data } = await wstApi.get<UserByID>(`/users/${userId}`)

        return data
    } catch (error) {
        console.log(error)

        throw new Error(`Error getting User by Id ${userId}`)
    }
}

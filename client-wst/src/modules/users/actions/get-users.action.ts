import { wstApi } from '@/api/wstApi'
import type { User } from '../interfaces/users.interface'

export const getUsersAction = async (page: number = 1, limit: number = 9) => {
    try {
        const { data } = await wstApi.get<User[]>(`/users?limit=${limit}&offset=${page * limit}`)

        return data
    } catch (error) {
        console.log(error)
        throw new Error('Error getting Users')
    }
}

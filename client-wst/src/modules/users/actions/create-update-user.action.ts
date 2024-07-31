import { wstApi } from '@/api/wstApi'
import type { User } from '../interfaces/users.interface'

export const createUpdateUserAction = async (user: Partial<User>) => {
    if (user.id && user.id !== undefined) {
        return await updateUser(user)
       
    }

    throw new Error('No implementado el')
}

const updateUser = async (user: Partial<User>) => {
    const userId = user.id
    delete user.id

    try {
        const { data } = await wstApi.put<User>(`/users/${userId}`, user)

        return data
    } catch (error) {
        console.log(error)
        throw new Error('Error updating user')
    }
}

import { wstApi } from '@/api/wstApi'
import type { Fine } from '@/modules/users/interfaces/userbyid.interface'

export const getFinesAction = async (page: number = 1, limit: number = 10) => {
    try {
        const { data } = await wstApi.get<Fine[]>(
            `/fines?limit=${limit}&offset=${(page - 1) * limit}`
        )

        return data
    } catch (error) {
        console.log(error)

        throw new Error('Error getting Fines')
    }
}

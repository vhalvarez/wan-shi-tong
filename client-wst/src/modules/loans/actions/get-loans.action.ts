import { wstApi } from '@/api/wstApi'
import type { Loan } from '../interfaces/loans.interface'

export const getLoansAction = async (page: number = 1, limit: number = 10) => {
    try {
        const { data } = await wstApi.get<Loan[]>(
            `/loans?limit=${limit}&offset=${(page - 1) * limit}`
        )

        return data
    } catch (error) {
        console.log(error)

        throw new Error('Error getting Fines')
    }
}

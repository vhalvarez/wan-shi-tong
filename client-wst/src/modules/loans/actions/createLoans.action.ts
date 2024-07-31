import { wstApi } from '@/api/wstApi'
import type { Loan } from '../interfaces/loans.interface'

export const createLoanAction = async (loan: Partial<Loan>) => {
    if (loan.id && loan.id !== undefined) {
        return await updateLoan(loan)
    }

    throw new Error('No implementado el actualizar el prestamo')
}

const updateLoan = async (loan: Partial<Loan>) => {
    const loanId = loan.id
    delete loan.id

    try {
        const { data } = await wstApi.post<Loan>('/loans', loan)

        return data
    } catch (error) {
        console.log(error)
        throw new Error('Error updating user')
    }
}

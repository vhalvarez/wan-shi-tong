import type { Fines } from '../interfaces/fines.interface'

export const createFinesAction = async (fine: Partial<Fines>) => {
    console.log({fine});
    
}

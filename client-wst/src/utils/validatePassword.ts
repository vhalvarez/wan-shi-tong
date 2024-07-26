import type { PasswordValidationResult } from "@/interfaces/validatePassword.interface"


export const validatePassword = (password: string): PasswordValidationResult => {
    return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
}

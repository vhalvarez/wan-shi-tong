import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { AuthStatus, type User } from '../interfaces'
import { loginAction, registerAction, checkAuthAction } from '../actions'
import { useLocalStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const authStatus = ref<AuthStatus>(AuthStatus.Checking)
    const user = ref<User | undefined>()
    const token = ref(useLocalStorage('token', ''))
    const router = useRouter()

    const login = async (email: string, password: string) => {
        try {
            const loginResponse = await loginAction(email, password)

            if (!loginResponse.ok) {
                logout()
                return false
            }

            user.value = loginResponse.user
            token.value = loginResponse.token
            authStatus.value = AuthStatus.Authenticated

            return true
        } catch (error) {
            return logout()
        }
    }

    const register = async (name: string, email: string, password: string, cedula: string) => {
        try {
            const registerResponse = await registerAction(name, email, password, cedula)

            if (!registerResponse.ok) {
                logout()
                return { ok: false, message: registerResponse.message }
            }
            user.value = registerResponse.user
            token.value = registerResponse.token
            authStatus.value = AuthStatus.Authenticated

            return { ok: true, message: 'Usuario registrado' }
        } catch (error) {
            return { ok: false, message: 'Error al registrar el usuario' }
        }
    }

    const logout = () => {
        authStatus.value = AuthStatus.unAuthenticated
        user.value = undefined
        token.value = ''
        // router.push({ name: 'home'})
        return
    }

    const checkAuthStatus = async (): Promise<boolean> => {
        try {
            const statusResp = await checkAuthAction()

            if (!statusResp.ok) {
                logout()

                return false
            }

            authStatus.value = AuthStatus.Authenticated
            user.value = statusResp.user
            token.value = statusResp.token
            return true
        } catch (error) {
            logout()
            return false
        }
    }

    return {
        user,
        authStatus,
        token,

        // Getters
        isCheking: computed(() => authStatus.value === AuthStatus.Checking),
        isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),
        isAdmin: computed(
            () =>
                user.value?.roles.includes('Administrador') ?? false
        ),
        username: computed(() => user.value?.name),

        // Actions
        login,
        logout,
        register,
        checkAuthStatus
    }
})

<template>
    <div class="flex justify-center self-center z-10">
        <div class="p-12 bg-base-100 mx-auto rounded-2xl w-100">
            <RouterLink :to="{ name: 'home' }">
                <img src="../../../assets/img/logo.png" class="h-16 m-auto" />
            </RouterLink>
            <div class="mb-4">
                <h3 class="font-semibold text-2xl text-gray-800">Unete</h3>
                <p class="text-gray-500">Por favor ingresa tus datos.</p>
            </div>
            <form class="space-y-5" @submit.prevent="onRegister">
                <div class="space-y-2 w-full">
                    <label class="input input-bordered flex items-center gap-2">
                        Nombre
                        <input
                            v-model="myForm.name"
                            ref="nameInputRef"
                            type="text"
                            class="grow"
                            placeholder="Hernan Victor"
                            required
                        />
                    </label>
                </div>
                <div class="space-y-2 w-full">
                    <label class="input input-bordered flex items-center gap-2">
                        Correo
                        <input
                            v-model="myForm.email"
                            ref="emailInputRef"
                            type="email"
                            class="grow"
                            placeholder="victor@hernan.com"
                            required
                        />
                    </label>
                </div>
                <div class="space-y-2 w-full">
                    <label class="input input-bordered flex items-center gap-2">
                        Cédula
                        <input
                            v-model="myForm.cedula"
                            ref="cedulaInputRef"
                            type="text"
                            class="grow"
                            placeholder="24992476"
                            required
                            @input="formatCedula"
                        />
                    </label>
                    <div
                        class="label flex items-center"
                        :class="{
                            'text-green-500': cedulaValid,
                            'text-red-500': !cedulaValid
                        }"
                    >
                        <span class="label-text-alt">Debe tener entre 7 y 8 números.</span>
                        <span v-if="cedulaValid" class="icon icon-valid">✔️</span>
                        <span v-else class="icon icon-invalid">❌</span>
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="input input-bordered flex items-center gap-2">
                        Contraseña
                        <input
                            type="password"
                            class="grow"
                            v-model="password"
                            ref="passwordInputRef"
                            @input="handlePasswordInput"
                            required
                        />
                    </label>
                    <div
                        class="label flex items-center"
                        :class="{
                            'text-green-500': passwordValid.length,
                            'text-red-500': !passwordValid.length
                        }"
                    >
                        <span class="label-text-alt">Debe tener 8 caracteres.</span>
                        <span v-if="passwordValid.length" class="icon icon-valid">✔️</span>
                        <span v-else class="icon icon-invalid">❌</span>
                    </div>
                    <div
                        class="label flex items-center"
                        :class="{
                            'text-green-500': passwordValid.uppercase,
                            'text-red-500': !passwordValid.uppercase
                        }"
                    >
                        <span class="label-text-alt">Incluir letra mayuscula.</span>
                        <span v-if="passwordValid.uppercase" class="icon icon-valid">✔️</span>
                        <span v-else class="icon icon-invalid">❌</span>
                    </div>
                    <div
                        class="label flex items-center"
                        :class="{
                            'text-green-500': passwordValid.lowercase,
                            'text-red-500': !passwordValid.lowercase
                        }"
                    >
                        <span class="label-text-alt">Incluir letra minuscula.</span>
                        <span v-if="passwordValid.lowercase" class="icon icon-valid">✔️</span>
                        <span v-else class="icon icon-invalid">❌</span>
                    </div>
                    <div
                        class="label flex items-center"
                        :class="{
                            'text-green-500': passwordValid.number,
                            'text-red-500': !passwordValid.number
                        }"
                    >
                        <span class="label-text-alt">Incluir un número.</span>
                        <span v-if="passwordValid.number" class="icon icon-valid">✔️</span>
                        <span v-else class="icon icon-invalid">❌</span>
                    </div>
                    <div
                        class="label flex items-center"
                        :class="{
                            'text-green-500': passwordValid.special,
                            'text-red-500': !passwordValid.special
                        }"
                    >
                        <span class="label-text-alt">Incluir un caracter especial.</span>
                        <span v-if="passwordValid.special" class="icon icon-valid">✔️</span>
                        <span v-else class="icon icon-invalid">❌</span>
                    </div>
                </div>
                <div class="flex items-center justify-center">
                    <div class="text-sm">
                        <RouterLink
                            :to="{ name: 'login' }"
                            class="text-green-400 hover:text-green-500"
                        >
                            ¿Ya tienes cuenta? Ingresa
                        </RouterLink>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        class="disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed w-full flex justify-center items-center bg-green-400 hover:bg-green-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                        :disabled="!allValid || isSubmitting"
                    >
                        <template v-if="isSubmitting">
                            <span class="loading loading-spinner"></span>
                        </template>
                        <template v-else> Registrarse </template>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { validatePassword } from '@/utils/validatePassword'
import { useAuthStore } from '../stores/auth.store'

const authStore = useAuthStore()

const toast = useToast()
const emailInputRef = ref<HTMLInputElement | null>(null)
const passwordInputRef = ref<HTMLInputElement | null>(null)
const nameInputRef = ref<HTMLInputElement | null>(null)
const cedulaInputRef = ref<HTMLInputElement | null>(null)

const password = ref('')
const passwordValid = ref({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
})

const myForm = reactive({
    email: '',
    password: '',
    name: '',
    cedula: ''
})

const cedulaValid = computed(() => {
    return /^\d{7,8}$/.test(myForm.cedula)
})

const handlePasswordInput = () => {
    passwordValid.value = validatePassword(password.value)
    myForm.password = password.value // Asigna el valor de la contraseña a myForm.password cuando todos los criterios se cumplan
}

const allValid = computed(() => {
    return (
        passwordValid.value.length &&
        passwordValid.value.uppercase &&
        passwordValid.value.lowercase &&
        passwordValid.value.number &&
        passwordValid.value.special &&
        myForm.email !== '' &&
        myForm.name !== '' &&
        cedulaValid.value
    )
})

const formatCedula = () => {
    myForm.cedula = myForm.cedula.replace(/\D/g, '')
}

const isSubmitting = ref(false)

const onRegister = async () => {
    if (myForm.name === '') {
        toast.error('El nombre no puede estar vacío.')
        return nameInputRef.value?.focus()
    }

    if (myForm.email === '') {
        toast.error('El correo no puede estar vacío.')
        return emailInputRef.value?.focus()
    }

    if (!cedulaValid.value) {
        toast.error('La cédula debe tener entre 7 y 8 números y no puede estar vacía.')
        return cedulaInputRef.value?.focus()
    }

    if (!allValid.value) {
        toast.error('La contraseña no cumple con los requisitos.')
        return passwordInputRef.value?.focus()
    }

    isSubmitting.value = true

    try {
        const formData = {
            fullName: myForm.name,
            email: myForm.email,
            cedula: myForm.cedula,
            password: myForm.password
        }

        const ok = await authStore.register(
            formData.fullName,
            formData.email,
            formData.password,
            formData.cedula
        )

        toast.success('Registro exitoso.')
        
    } catch (error) {
        toast.error('Error en el registro.')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
.icon {
    width: 20px;
    height: 20px;
    margin-left: 10px;
}

.icon-valid {
    color: green;
}

.icon-invalid {
    color: red;
}

.loading-spinner {
    border: 4px solid transparent;
    border-top: 4px solid white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>

<template>
    <div class="flex justify-center self-center z-10">
        <div class="p-12 bg-base-100 mx-auto rounded-2xl w-100">
            <RouterLink :to="{ name: 'home' }">
                <img src="../../../assets/img/logo.png" class="h-16 m-auto" />
            </RouterLink>

            <div class="mb-4">
                <h3 class="font-semibold text-2xl text-gray-800">Iniciar Sesión</h3>
                <p class="text-gray-500">Por favor ingresa con tu cuenta.</p>
            </div>

            <form class="space-y-5" @submit.prevent="onLogin">
                <div class="space-y-2 w-full">
                    <label className="input input-bordered flex items-center gap-2" for="email">
                        Correo
                        <input
                            type="text"
                            ref="emailInputRef"
                            className="grow"
                            placeholder="hernan@victor.com"
                            id="email"
                            name="email"
                            autocomplete="off"
                            v-model="myForm.email"
                        />
                    </label>
                </div>
                <div class="space-y-2">
                    <label className="input input-bordered flex items-center gap-2" for="password">
                        Contraseña
                        <input
                            type="password"
                            className="grow"
                            ref="passwordInputRef"
                            id="password"
                            name="password"
                            v-model="myForm.password"
                        />
                    </label>
                </div>
                <div class="flex items-center justify-center">
                    <div class="text-sm">
                        <RouterLink
                            :to="{ name: 'register' }"
                            class="text-primary hover:text-green-500"
                        >
                            ¿Aun no tienes cuenta? Unete
                        </RouterLink>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        class="w-full flex justify-center bg-green-400 hover:bg-primary text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                    >
                        Ingresar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const toast = useToast()
const emailInputRef = ref<HTMLInputElement | null>(null)
const passwordInputRef = ref<HTMLInputElement | null>(null)

const myForm = reactive({
    email: '',
    password: ''
})

const onLogin = async () => {
    if (myForm.email == '') {
        toast.error('El correo no puede estar vacio.')
        return emailInputRef.value?.focus()
    }

    if (myForm.password.length < 6) {
        return passwordInputRef.value?.focus()
    }

    const ok = await authStore.login(myForm.email, myForm.password)
    console.log(ok);
    
    if (ok) return

    toast.error('Usuario/Contraseña no son correctos')
}
</script>

<style></style>

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
            <div class="space-y-5">
                <div class="space-y-2 w-full">
                    <label className="input input-bordered flex items-center gap-2">
                        Nombre
                        <input type="text" className="grow" placeholder="Hernan Victor" />
                    </label>
                </div>
                <div class="space-y-2 w-full">
                    <label className="input input-bordered flex items-center gap-2">
                        Correo
                        <input type="email" className="grow" placeholder="victor@hernan.com" />
                    </label>
                </div>
                <div class="space-y-2">
                    <label className="input input-bordered flex items-center gap-2">
                        Contraseña
                        <input type="password" className="grow" />
                    </label>
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
                        class="w-full flex justify-center bg-green-400 hover:bg-green-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                    >
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup></script>

<style></style>

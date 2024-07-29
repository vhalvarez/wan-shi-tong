<template>
    <main class="flex-1 md:p-0 lg:pt-8 lg:px-8 flex flex-col">
        <div v-if="!user" class="text-center h-[500px]">
            <LoadingSpinner />
        </div>
        <section class="p-4" v-else>
            <div class="flex justify-between py-4">
                <ButtonBack :nameLink="'users-list'" />
                <h3 class="flex justify-center w-full text-2xl text-yellow-400 font-bold">
                    Editar
                </h3>
            </div>

            <div className="divider"></div>

            <div class="md:flex">
                <h2 class="md:w-1/3 uppercase tracking-wide text-sm sm:text-lg mb-6">
                    Usuario:
                    <span
                        :class="
                            user?.active ? 'font-bold text-green-500' : 'font-bold text-red-500'
                        "
                        >{{ user?.name }}</span
                    >
                </h2>
            </div>
            <form>
                <div class="md:flex mb-8">
                    <div class="md:w-1/3">
                        <legend class="uppercase tracking-wide text-md">Información General</legend>
                    </div>
                    <div class="md:flex-1 mt-2 mb:mt-0 md:px-3">
                        <div class="mb-4">
                            <label class="flex items-center gap-2 my-2 font-bold">Nombre </label>

                            <input
                                v-model="nombre"
                                type="text"
                                id="nombre"
                                class="grow input input-bordered w-full flex items-center"
                                placeholder="Tu nombre aqui"
                                required
                            />
                        </div>
                        <div class="mb-4">
                            <label class="flex items-center gap-2 my-2 font-bold">Correo </label>
                            <input
                                type="text"
                                class="grow input input-bordered w-full flex items-center"
                                placeholder="Tu nombre aqui"
                                required
                            />
                        </div>
                        <div class="mb-4">
                            <label class="flex items-center gap-2 my-2 font-bold"
                                >Contraseña
                            </label>
                            <input
                                type="text"
                                class="grow input input-bordered w-full flex items-center"
                                placeholder="Tu contra aqui"
                                required
                            />
                        </div>
                        <div class="md:flex mb-4">
                            <div class="md:flex-1 md:pr-3">
                                <label class="flex items-center gap-2 my-2 font-bold">Cédula</label>
                                <input
                                    type="text"
                                    class="grow input input-bordered w-full flex items-center"
                                    placeholder="Tu nombre aqui"
                                    required
                                />
                            </div>
                            <div class="md:flex-1 md:pl-3">
                                <label class="flex items-center gap-2 my-2 font-bold">Estado</label>
                                <select className="select w-full select-bordered">
                                    <option disabled selected>Seleccionar...</option>
                                    <option>Activo</option>
                                    <option>Inactivo</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="flex items-center gap-2 my-2 font-bold">Rol</label>
                            <p className="input input-bordered w-full flex items-center " disabled>
                                {{ user?.roles[0] }}
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </section>
        <pre>{{ values }}</pre>
    </main>
</template>

<script lang="ts" src="./EditUser.ts"></script>

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
                            <div class="indicator w-full">
                                <span class="indicator-item badge badge-accent">Obligatorio</span>
                                <input
                                    v-model="name"
                                    v-bind="nameAttrs"
                                    type="text"
                                    id="name"
                                    :class="[
                                        'grow input input-bordered w-full flex items-center',
                                        {
                                            'border-red-500': errors.name
                                        }
                                    ]"
                                    required
                                />
                            </div>
                            <span v-if="errors.name" class="text-red-500">{{
                                errors.name
                            }}</span>
                        </div>
                        <div class="mb-4">
                            <label class="flex items-center gap-2 my-2 font-bold">Correo</label>
                            <div class="indicator w-full">
                                <span class="indicator-item badge badge-accent">Obligatorio</span>
                                <input
                                    v-model="email"
                                    v-bind="emailAttrs"
                                    type="text"
                                    :class="[
                                        'grow input input-bordered w-full flex items-center',
                                        {
                                            'border-red-500': errors.email
                                        }
                                    ]"
                                    required
                                />
                            </div>
                            <span v-if="errors.email" class="text-red-500">{{ errors.email }}</span>
                        </div>
                        <div class="mb-4">
                            <label class="flex items-center gap-2 my-2 font-bold"
                                >Nueva Contraseña
                            </label>
                            <div class="indicator w-full">
                                <span class="indicator-item badge badge-primary"
                                    >No obligatorio</span
                                >
                                <input
                                    v-model="password"
                                    v-bind="passwordAttrs"
                                    type="password"
                                    :class="[
                                        'grow input input-bordered w-full flex items-center',
                                        {
                                            'border-red-500': errors.password
                                        }
                                    ]"
                                />
                            </div>
                            <span v-if="errors.password" class="text-red-500">{{
                                errors.password
                            }}</span>
                        </div>
                        <div class="md:flex mb-4">
                            <div class="md:flex-1 md:pr-3">
                                <label class="flex items-center gap-2 my-2 font-bold">Cédula</label>
                                <div class="indicator w-full">
                                    <span class="indicator-item badge badge-accent"
                                        >Obligatorio</span
                                    >
                                    <input
                                        v-model="cedula"
                                        v-bind="cedulaAttrs"
                                        type="text"
                                        :class="[
                                            'grow input input-bordered w-full flex items-center',
                                            {
                                                'border-red-500': errors.cedula
                                            }
                                        ]"
                                        placeholder="Tu nombre aqui"
                                        required
                                    />
                                </div>
                                <span v-if="errors.cedula" class="text-red-500">{{
                                    errors.cedula
                                }}</span>
                            </div>
                            <div class="md:flex-1 md:pl-3">
                                <label class="flex items-center gap-2 my-2 font-bold">Estado</label>

                                <div class="indicator w-full">
                                    <span class="indicator-item badge badge-accent"
                                        >Obligatorio</span
                                    >
                                    <select
                                        v-model="active"
                                        v-bind="activeAttrs"
                                        :class="[
                                            'select w-full select-bordered',
                                            {
                                                'border-red-500': errors.active
                                            }
                                        ]"
                                    >
                                        <option disabled selected>Seleccionar...</option>
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>

                                <span v-if="errors.active" class="text-red-500">{{
                                    errors.active
                                }}</span>
                            </div>
                        </div>

                        <div class="md:flex-1">
                            <label class="flex items-center gap-2 my-2 font-bold">Roles</label>

                            <div class="indicator w-full">
                                <span class="indicator-item badge badge-primary"
                                    >No obligatorio</span
                                >
                                <select
                                    :class="[
                                        'select w-full select-bordered',
                                        {
                                            'border-red-500': errors.roles
                                        }
                                    ]"
                                    v-model="roles"
                                    v-bind="rolesAttrs"
                                >
                                    <option disabled selected>Seleccionar...</option>
                                    <option value="Estudiante">Estudiante</option>
                                    <option value="Administrador">Administrador</option>
                                </select>
                            </div>

                            <span v-if="errors.roles" class="text-red-500">{{ errors.roles }}</span>
                        </div>
                    </div>
                </div>
            </form>
        </section>
        <pre>{{ values }}</pre>
        <pre>{{ errors }}</pre>
    </main>
</template>

<script lang="ts" src="./EditUser.ts"></script>

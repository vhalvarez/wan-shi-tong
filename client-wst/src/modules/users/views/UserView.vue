<template>
    <main class="flex-1 md:p-0 lg:pt-8 lg:px-8 flex flex-col">
        <div v-if="!user" class="text-center h-[500px]">
            <LoadingSpinner />
        </div>
        <section class="p-4" v-else>

            <div class="flex justify-between py-4">
                <ButtonBack :nameLink="'users-list'"/>
                <h3 class="flex justify-center w-full text-2xl text-secondary font-bold"> Información </h3>
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
                            <p className="input input-bordered w-full flex items-center " disabled>
                                {{ user?.name }}
                            </p>
                        </div>
                        <div class="mb-4">
                            <label class="flex items-center gap-2 my-2 font-bold">Correo </label>
                            <p className="input input-bordered w-full flex items-center " disabled>
                                {{ user?.email }}
                            </p>
                        </div>
                        <div class="md:flex mb-4">
                            <div class="md:flex-1 md:pr-3">
                                <label class="flex items-center gap-2 my-2 font-bold">Cédula</label>
                                <p
                                    className="input input-bordered w-full flex items-center "
                                    disabled
                                >
                                    {{ user?.cedula }}
                                </p>
                            </div>
                            <div class="md:flex-1 md:pl-3">
                                <label class="flex items-center gap-2 my-2 font-bold">Estado</label>
                                <p
                                    className="input input-bordered w-full flex items-center "
                                    disabled
                                >
                                    {{ user?.active ? 'Activo' : 'Inactivo' }}
                                </p>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="flex items-center gap-2 my-2 font-bold">Rol</label>
                            <p className="input input-bordered w-full flex items-center " disabled>
                                {{ user?.roles }}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="divider"></div>

                <div class="md:flex mb-8">
                    <div class="md:w-1/3">
                        <legend class="uppercase tracking-wide text-sm">Préstamos</legend>
                    </div>
                    <div class="md:flex-1 mt-2 mb:mt-0 md:px-3" v-if="user?.loans.length > 0">
                        <div class="overflow-x-auto">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Autor</th>
                                        <th>Categoría</th>
                                        <th>Fecha de Préstamo</th>
                                        <th>Estado</th>
                                        <th>Fecha de Devolución</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="loan in user?.loans" :key="loan.id">
                                        <td>
                                            <div class="flex items-center gap-3">
                                                <div class="avatar">
                                                    <div class="mask mask-squircle h-12 w-12">
                                                        <img
                                                            :src="loan.book.portada"
                                                            :alt="loan.book.titulo"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div class="font-bold">
                                                        {{ loan.book.titulo }}
                                                    </div>
                                                    <div class="text-sm opacity-50">
                                                        {{ loan.book.isbn }}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{{ loan.book.autor }}</td>
                                        <td>{{ loan.book.category }}</td>
                                        <td>
                                            {{ new Date(loan.fecha_prestamo).toLocaleDateString() }}
                                        </td>
                                        <td>
                                            <span
                                                :class="
                                                    loan.estado === 'prestado'
                                                        ? 'badge badge-accent badge-sm capitalize'
                                                        : 'badge badge-primary badge-sm capitalize'
                                                "
                                            >
                                                {{ loan.estado }}
                                            </span>
                                        </td>
                                        <td>
                                            {{
                                                loan.fecha_devolucion
                                                    ? new Date(
                                                          loan.fecha_devolucion
                                                      ).toLocaleDateString()
                                                    : ''
                                            }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="md:flex-1 mt-2 mb:mt-0 md:px-3" v-else>
                        <div role="alert" className="alert alert-info">
                            <BellAlertIcon class="size-6 text-white" />
                            <span>Este usuario no posee préstamos.</span>
                        </div>
                    </div>
                </div>

                <div className="divider"></div>

                <div class="md:flex mb-8">
                    <div class="md:w-1/3">
                        <legend class="uppercase tracking-wide text-sm">Multas</legend>
                    </div>
                    <div class="md:flex-1 mt-2 mb:mt-0 md:px-3" v-if="user?.fines.length > 0">
                        <div class="overflow-x-auto">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Monto</th>
                                        <th>Estado</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="multa in user?.fines" :key="multa.id">
                                        <td>
                                            <div class="flex items-center gap-3">
                                                <div class="font-bold">
                                                    {{ multa.monto.toFixed(2) }} $
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span
                                                :class="
                                                    !multa.pagada
                                                        ? 'badge badge-accent badge-sm capitalize'
                                                        : 'badge badge-primary badge-sm capitalize'
                                                "
                                            >
                                                {{ !multa.pagada ? 'No pagada' : 'Pagada' }}
                                            </span>
                                        </td>

                                        <td>
                                            {{
                                                multa.fecha_multa
                                                    ? new Date(
                                                          multa.fecha_multa
                                                      ).toLocaleDateString()
                                                    : ''
                                            }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="md:flex-1 mt-2 mb:mt-0 md:px-3" v-else>
                        <div role="alert" className="alert alert-info">
                            <BellAlertIcon class="size-6 text-white" />
                            <span>Este usuario no posee multas.</span>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    </main>
</template>

<script lang="ts" src="./UserView.ts"></script>

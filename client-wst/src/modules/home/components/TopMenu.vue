<template>
    <div class="container mx-auto sticky">
        <div class="navbar bg-primary md:rounded-xl md:my-4">
            <div class="navbar-start">
                <div class="dropdown">
                    <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>
                    <ul
                        tabindex="0"
                        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                    >
                        <li><a>Item 1</a></li>
                        <li>
                            <a>Parent</a>
                            <ul class="p-2">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </li>
                        <li><a>Item 3</a></li>
                    </ul>
                </div>
                <RouterLink :to="{ name: 'home' }">
                    <img src="../../../assets/img/logo_white.png" alt="Logo" class="w-16 md:w-24" />
                </RouterLink>
            </div>
            <div class="navbar-center hidden lg:flex w-2/4">
                <div class="relative text-primary form-control w-full">
                    <input
                        type="search"
                        name="serch"
                        placeholder="Buscar libro..."
                        class="bg-secondary-content h-10 px-5 pr-10 rounded-md text-sm focus:outline-none w-full"
                        autocomplete="true"
                    />
                    <button type="submit" class="absolute right-0 top-0 mt-3 mr-4">
                        <svg
                            class="h-4 w-4 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            version="1.1"
                            id="Capa_1"
                            x="0px"
                            y="0px"
                            viewBox="0 0 56.966 56.966"
                            style="enable-background: new 0 0 56.966 56.966"
                            xml:space="preserve"
                            width="512px"
                            height="512px"
                        >
                            <path
                                d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="navbar-end gap-2">
                <template v-if="!authStore.isAuthenticated">
                    <RouterLink :to="{ name: 'login' }">Ingresa</RouterLink>
                    <RouterLink :to="{ name: 'register' }" class="btn btn-primary-content"
                        >Unete</RouterLink
                    >
                </template>

                <template v-if="authStore.isAuthenticated">
                    <!-- <RouterLink v-if="authStore.isAdmin" to="/admin">Admin</RouterLink>-->
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex="{0}"
                            role="button"
                            className="btn btn-ghost btn-circle avatar flex"
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                                />
                            </div>

                            <div>Hola</div>
                        </div>
                        <ul
                            tabIndex="{0}"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-4 shadow gap-4"
                        >
                            <li>
                                <a className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li><a>Settings</a></li>
                            <button @click="authStore.logout()" class="btn bg-error">Salir</button>
                        </ul>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/stores/auth.store'

const authStore = useAuthStore()
</script>

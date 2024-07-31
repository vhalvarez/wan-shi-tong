<template>
    <div class="overflow-x-auto">
        <table class="table">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Cantidad Disponible</th>
                    <th>Cantidad Total</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="book in books" :key="book.id">
                    <td>
                        <div class="flex items-center gap-3">
                            <div class="avatar">
                                <div class="mask mask-squircle h-12 w-12">
                                    <img :src="book.portada" :alt="book.titulo" />
                                </div>
                            </div>
                            <div>
                                <div class="font-bold capitalize">{{ book.titulo }}</div>
                                <div class="text-sm opacity-50">{{ book.isbn }}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        {{ book.autor }}
                        <br />
                        <span class="badge badge-ghost badge-sm">{{ book.anio_publicacion }}</span>
                    </td>
                    <td>{{ book.cantidad_disponible }}</td>
                    <td>{{ book.cantidad_total }}</td>
                    <td>{{ book.category }}</td>
                    <td class="flex gap-2">
                        <router-link :to="{ path: `/book/${book.id}` }">
                            <EyeIcon class="size-6 cursor-pointer text-blue-500" />
                        </router-link>
                        <PencilSquareIcon
                            class="size-6 cursor-pointer text-yellow-500"
                            @click="openEditModal(book)"
                        />
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Cantidad Disponible</th>
                    <th>Cantidad Total</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                </tr>
            </tfoot>
        </table>

        <!-- Modal de edición -->
        <input type="checkbox" id="editBookModal" class="modal-toggle" ref="editModalToggle" />
        <form class="modal" role="dialog" @submit.prevent="onEditBook" enctype="multipart/form-data">
            <div class="modal-box text-center">
                <h3 class="text-lg font-bold">Editar Libro</h3>
                <label class="input input-bordered flex items-center gap-2 my-3">
                    Título
                    <input
                        type="text"
                        class="grow"
                        placeholder="Título del libro"
                        v-model="editForm.titulo"
                        required
                    />
                </label>
                <label class="input input-bordered flex items-center gap-2 my-3">
                    Autor
                    <input
                        type="text"
                        class="grow"
                        placeholder="Autor del libro"
                        v-model="editForm.autor"
                        required
                    />
                </label>
                <label class="input input-bordered flex items-center gap-2 my-3">
                    Año de Publicación
                    <input
                        type="number"
                        :min="1000"
                        :max="new Date().getFullYear()"
                        class="grow"
                        placeholder="Año de Publicación"
                        v-model="editForm.anio_publicacion"
                        required
                    />
                </label>
                <label class="input input-bordered flex items-center gap-2 my-3">
                    Cantidad Disponible
                    <input
                        type="number"
                        min="0"
                        class="grow"
                        placeholder="Cantidad Disponible"
                        v-model="editForm.cantidad_disponible"
                        required
                    />
                </label>
                <label class="input input-bordered flex items-center gap-2 my-3">
                    Categoría
                    <select class="grow" v-model="editForm.categoryId" required>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                </label>
                <label class="input input-bordered flex items-center gap-2 my-3">
                    Descripción
                    <textarea
                        class="grow"
                        placeholder="Descripción del libro"
                        v-model="editForm.descripcion"
                        required
                    ></textarea>
                </label>
                <label class="input input-bordered flex items-center gap-2 my-3">
                    Portada
                    <input type="file" class="file-input w-full max-w-xs" @change="onEditFileChange" />
                </label>
                <button class="btn btn-primary w-full mt-2" :disabled="isSubmitting">
                    <template v-if="isSubmitting">
                        <span class="loading loading-spinner"></span>
                    </template>
                    <template v-else> Enviar </template>
                </button>
                <div class="modal-action">
                    <label for="editBookModal" class="btn btn-outline btn-error w-full">Cancelar</label>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { PencilSquareIcon, EyeIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { wstApi } from '@/api/wstApi'
import { useToast } from 'vue-toastification'
import { getCategoriesAction } from '@/modules/categories/actions/get-categories.action'
import type { Book } from '../interfaces/books.interface'

interface Props {
    books: Book[]
}

defineProps<Props>()

const emits = defineEmits(['book-updated'])

const toast = useToast()

const editForm = ref({
    id: null,
    titulo: '',
    autor: '',
    anio_publicacion: new Date().getFullYear(),
    cantidad_disponible: 1,
    descripcion: '',
    categoryId: '',
    portada: null
})

const isSubmitting = ref(false)

const onEditFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files[0]) {
        editForm.value.portada = target.files[0]
    }
}

const openEditModal = (book: Book) => {
    editForm.value = { ...book }
    document.getElementById('editBookModal').checked = true
}

// Obtener las categorías desde el endpoint
const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategoriesAction()
})

const onEditBook = async () => {
    isSubmitting.value = true

    try {
        const formData = new FormData()
        formData.append('titulo', editForm.value.titulo)
        formData.append('autor', editForm.value.autor)
        formData.append('anio_publicacion', editForm.value.anio_publicacion.toString())
        formData.append('cantidad_disponible', editForm.value.cantidad_disponible.toString())
        formData.append('descripcion', editForm.value.descripcion)
        formData.append('categoryId', editForm.value.categoryId)
        if (editForm.value.portada) {
            formData.append('portada', editForm.value.portada)
        }

        const response = await wstApi.put(`/books/${editForm.value.id}`, formData)

        toast.success('Libro actualizado correctamente.')
        emits('book-updated')
        document.getElementById('editBookModal').checked = false
    } catch (error) {
        console.error(error)
        toast.error('Error al actualizar el libro.')
    } finally {
        isSubmitting.value = false
    }
}
</script>

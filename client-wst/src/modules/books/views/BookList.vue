<template>
    <div class="flex flex-col justify-center w-full ml-5">
        <div v-if="!books" class="text-center h-[500px]">
            <LoadingSpinner />
        </div>

        <div v-else>
            <CustomTitle :title="'Listado de Libros'" />

            <div class="flex justify-center p-4">
                <label for="createBookModal" class="btn btn-primary">Crear Libro</label>

                <input
                    type="checkbox"
                    id="createBookModal"
                    class="modal-toggle"
                    ref="modalToggle"
                />
                <form
                    class="modal"
                    role="dialog"
                    @submit.prevent="onCreateBook"
                    enctype="multipart/form-data"
                >
                    <div class="modal-box text-center">
                        <h3 class="text-lg font-bold">Crear Libro</h3>

                        <label class="input input-bordered flex items-center gap-2 my-3">
                            Título
                            <input
                                type="text"
                                class="grow"
                                placeholder="Título del libro"
                                v-model="bookForm.titulo"
                                required
                            />
                        </label>

                        <label class="input input-bordered flex items-center gap-2 my-3">
                            Autor
                            <input
                                type="text"
                                class="grow"
                                placeholder="Autor del libro"
                                v-model="bookForm.autor"
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
                                v-model="bookForm.anio_publicacion"
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
                                v-model="bookForm.cantidad_disponible"
                                required
                            />
                        </label>

                        <label class="input input-bordered flex items-center gap-2 my-3">
                            Categoría
                            <select class="grow" v-model="bookForm.categoryId" required>
                                <option
                                    v-for="category in categories"
                                    :key="category.id"
                                    :value="category.id"
                                >
                                    {{ category.name }}
                                </option>
                            </select>
                        </label>

                        <label class="input input-bordered flex items-center gap-2 my-3">
                            Descripción
                            <input
                                class="grow"
                                placeholder="Descripción del libro"
                                v-model="bookForm.descripcion"
                                required
                            />
                        </label>

                        <label class="input input-bordered flex items-center gap-2 my-3">
                            Portada
                            <input type="file" className="file-input w-full max-w-xs"  @change="onFileChange"/>
                        </label>

                        <button
                            class="btn btn-primary w-full mt-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
                            :disabled="isSubmitting"
                        >
                            <template v-if="isSubmitting">
                                <span class="loading loading-spinner"></span>
                            </template>
                            <template v-else> Enviar </template>
                        </button>

                        <div class="modal-action">
                            <label for="createBookModal" class="btn btn-outline btn-error w-full"
                                >Cancelar</label
                            >
                        </div>
                    </div>
                </form>
            </div>

            <TableBook :books="books" @book-returned="invalidateBooksQuery" />

            <ButtonPagination :has-more-data="!!books && books.length < 9" :page="page" />
        </div>
    </div>
</template>

<script setup lang="ts">
import CustomTitle from '@/modules/common/components/CustomTitle.vue'
import TableBook from '../components/TableBook.vue'
import { useRoute } from 'vue-router'
import { ref, watch, watchEffect } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { getBooksAction } from '../actions'
import ButtonPagination from '@/modules/common/components/ButtonPagination.vue'
import LoadingSpinner from '@/modules/common/components/LoadingSpinner.vue'
import { getCategoriesAction } from '@/modules/categories/actions/get-categories.action'
import { wstApi } from '@/api/wstApi'
import { useToast } from 'vue-toastification'

const route = useRoute()
const page = ref(Number(route.query.page || 1))
const queryClient = useQueryClient()
const toast = useToast()

const { data: books = [] } = useQuery({
    queryKey: ['books', { page: page }],
    queryFn: () => getBooksAction(page.value)
})

const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategoriesAction()
})

watch(
    () => route.query.page,
    (newPage) => {
        page.value = Number(newPage || 1)

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
)

watchEffect(() => {
    queryClient.prefetchQuery({
        queryKey: ['books', { page: page.value + 1 }],
        queryFn: () => getBooksAction(page.value + 1)
    })
})

const invalidateBooksQuery = () => {
    queryClient.invalidateQueries(['books', { page: page.value }])
}

const bookForm = ref({
    titulo: '',
    autor: '',
    isbn: '',
    anio_publicacion: new Date().getFullYear(),
    cantidad_total: 1,
    descripcion: '',
    categoryId: '',
    portada: ''
})

const isSubmitting = ref(false)

const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files[0]) {
        bookForm.value.portada = target.files[0]
    }
}

const onCreateBook = async () => {
    isSubmitting.value = true

    try {
        const formData = new FormData()
        formData.append('titulo', bookForm.value.titulo)
        formData.append('autor', bookForm.value.autor)
        formData.append('anio_publicacion', bookForm.value.anio_publicacion.toString())
        formData.append('cantidad_total', bookForm.value.cantidad_disponible.toString())
        formData.append('descripcion', bookForm.value.descripcion)
        formData.append('categoryId', bookForm.value.categoryId)
        if (bookForm.value.portada) {
            formData.append('portada', bookForm.value.portada)
        }

        await wstApi.post('/books', formData)

        toast.success('Libro creado correctamente.')
        
        invalidateBooksQuery()
        bookForm.value = {
            titulo: '',
            autor: '',
            isbn: '',
            anio_publicacion: new Date().getFullYear(),
            cantidad_total: 1,
            descripcion: '',
            categoryId: '',
            portada: ''
        }
        
    } catch (error) {
        console.error(error)
    } finally {
        isSubmitting.value = false
    }
}
</script>

import { useQuery } from '@tanstack/vue-query'
import { defineComponent, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { getBookByIdAction } from '../actions'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import LoadingSpinner from '@/modules/common/components/LoadingSpinner.vue'
import { BellAlertIcon } from '@heroicons/vue/24/solid'
import ButtonBack from '@/modules/common/components/ButtonBack.vue'
import { wstApi } from '@/api/wstApi'
import { useToast } from 'vue-toastification'

export default defineComponent({
    components: {
        Breadcrumbs,
        BellAlertIcon,
        LoadingSpinner,
        ButtonBack
    },
    props: {
        bookId: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const router = useRouter()
        const toast = useToast()

        const authStore = useAuthStore()

        const {
            data: book,
            isError,
            isLoading
        } = useQuery({
            queryKey: ['book', props.bookId],
            queryFn: () => getBookByIdAction(props.bookId),
            retry: false
        })

        watchEffect(() => {
            if (isError.value && !isLoading.value) {
                router.replace('/')
            }
        })

        const onCreateLoan = async () => {
            if (!authStore.user) {
                toast.error('Debe estar autenticado para solicitar un préstamo')
                return
            }

            try {
                const { data } = await wstApi.post('/loans', {
                    cedula: authStore.user.cedula,
                    bookId: props.bookId
                })

                console.log(data)
                toast.success('Prestamo solicitado a Biblioteca exitosamente.')

                return data
            } catch (error) {
                console.error(error)
                if (error.response && error.response.data) {
                    toast.error(error.response.data.message || 'Error al solicitar el préstamo')
                } else {
                    toast.error('Hubo un problema al solicitar el préstamo')
                }
            }
        }

        return {
            book,
            isLoading,
            authStore,
            onCreateLoan
        }
    }
})

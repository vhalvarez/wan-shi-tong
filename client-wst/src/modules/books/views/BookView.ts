import { useQuery } from '@tanstack/vue-query'
import { defineComponent, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { getBookByIdAction } from '../actions'
import Breadcrumbs from '../components/Breadcrumbs.vue'

import { useAuthStore } from '@/modules/auth/stores/auth.store'
import LoadingSpinner from '@/modules/common/components/LoadingSpinner.vue'
import { BellAlertIcon } from '@heroicons/vue/24/solid'
import ButtonBack from '@/modules/common/components/ButtonBack.vue'

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


        return {
            book,
            isLoading,
            authStore

        }
    }
})

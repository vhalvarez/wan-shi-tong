import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { defineComponent, ref, watch, watchEffect } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { BellAlertIcon } from '@heroicons/vue/24/solid'
import LoadingSpinner from '@/modules/common/components/LoadingSpinner.vue'
import ButtonBack from '@/modules/common/components/ButtonBack.vue'
import CustomTitle from '@/modules/common/components/CustomTitle.vue'
import { getCategoriesBookByIdAction } from '../actions/get-categories-by-id.action copy'
import BookList from '@/modules/books/components/BookList.vue'
import ButtonPagination from '@/modules/common/components/ButtonPagination.vue'

export default defineComponent({
    components: {
        BellAlertIcon,
        LoadingSpinner,
        ButtonBack,
        CustomTitle,
        BookList,
        ButtonPagination,
    },
    props: {
        categoryId: {
            type: String,
            required: true
        }
    },

    setup(props) {
        const route = useRoute()
        const router = useRouter()
        const page = ref(Number(route.query.page || 1))
        const queryClient = useQueryClient()
        
        const {
            data: category = [],
            isError,
            isLoading
        } = useQuery({
            queryKey: ['category', {categoryId: props.categoryId, page: page}],
            queryFn: () => getCategoriesBookByIdAction(props.categoryId, page.value),
            retry: false
        })

        watchEffect(() => {
            if (isError.value && !isLoading.value) {
                router.replace('/')
            }
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
                queryKey: ['category', { page: page.value + 1 }],
                queryFn: () => getCategoriesBookByIdAction(props.categoryId, page.value + 1)
            })
        })

        return {
            category,
            page
        }
    }
})

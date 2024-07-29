import { useQuery } from '@tanstack/vue-query'
import { defineComponent, watchEffect } from 'vue'
import { getUserByIdAction } from '../actions/get-users-by-id.action'
import { useRouter } from 'vue-router'
import { BellAlertIcon } from '@heroicons/vue/24/solid'
import LoadingSpinner from '@/modules/common/components/LoadingSpinner.vue'
import ButtonBack from '@/modules/common/components/ButtonBack.vue'

export default defineComponent({
    components: {
        BellAlertIcon,
        LoadingSpinner,
        ButtonBack
    },
    props: {
        userId: {
            type: String,
            required: true
        }
    },

    setup(props) {
        const router = useRouter()
        const {
            data: user,
            isError,
            isLoading
        } = useQuery({
            queryKey: ['user', props.userId],
            queryFn: () => getUserByIdAction(props.userId),
            retry: false
        })

        watchEffect(() => {
            if (isError.value && !isLoading.value) {
                router.replace('/')
            }
        })

        return {
            user
        }
    }
})

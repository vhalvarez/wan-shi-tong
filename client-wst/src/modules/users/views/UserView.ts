import { useQuery } from '@tanstack/vue-query'
import { defineComponent, watchEffect } from 'vue'
import { getUserByIdAction } from '../actions/get-users-by-id.action'
import { useRouter } from 'vue-router'
import { BellAlertIcon } from '@heroicons/vue/24/solid'
import LoadingSpinner from '@/modules/common/components/LoadingSpinner.vue'
import ButtonBack from '@/modules/common/components/ButtonBack.vue'
import CustomTitle from '@/modules/common/components/CustomTitle.vue'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

export default defineComponent({
    components: {
        BellAlertIcon,
        LoadingSpinner,
        ButtonBack,
        CustomTitle
    },
    props: {
        userId: {
            type: String,
            required: true
        }
    },

    setup(props) {
        const router = useRouter()

        const authStore = useAuthStore()

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
            user,
            authStore
        }
    }
})

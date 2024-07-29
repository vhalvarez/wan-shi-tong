import { useQuery } from '@tanstack/vue-query'
import { defineComponent, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { getUserByIdAction } from '../actions'
import type { User } from '../interfaces/users.interface'
import { useForm } from 'vee-validate'

export default defineComponent({
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

        const { values, defineField } = useForm()

        const [email, emailAttrs] = defineField('email')
        const [nombre, nombreAttrs] = defineField('nombre')
        const [password, passwordAttrs] = defineField('password')
        const [cedula, cedulaAttrs] = defineField('cedula')
        const [active, activeAttrs] = defineField('active')
        const [roles, rolesAttrs] = defineField('roles')

        watchEffect(() => {
            if (isError.value && !isLoading.value) {
                router.replace('/')
            }
        })

        return {
            user,
            values,

            email,
            emailAttrs,
            nombre,
            nombreAttrs,
            password,
            passwordAttrs,
            cedula,
            cedulaAttrs,
            active,
            activeAttrs,
            roles,
            rolesAttrs
        }
    }
})

import { useQuery } from '@tanstack/vue-query'
import { defineComponent, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { getUserByIdAction } from '../actions'
import { useForm } from 'vee-validate'
import ButtonBack from '@/modules/common/components/ButtonBack.vue'
import * as yup from 'yup'

const validationSchema = yup.object({
    email: yup
        .string()
        .required('El correo es obligatorio.')
        .email('Tiene que ser un email valido.'),
    nombre: yup
        .string()
        .required('El nombre es obligatorio.')
        .min(3, 'El nombre tiene que tener min 3 caracteres.'),
    password: yup
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .matches(/[a-z]/, 'La contraseña debe tener al menos una letra minúscula')
        .matches(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
        .matches(/\d/, 'La contraseña debe tener al menos un número')
        .matches(/[@$!%*?&]/, 'La contraseña debe tener al menos un carácter especial (@$!%*?&)'),
    active: yup.boolean().required('El estado es obligatorio.'),
    cedula: yup
        .string()
        .min(7, 'La cedula tiene que tener min 7 caracteres.')
        .max(8, 'La cedula tiene que tener max 8 caracteres.')
        .required('La cedula es obligatorio.'),
    roles: yup.string().oneOf(['Administrador', 'Estudiante'], "Tiene que elegir entre Estudiante o Administrador.")
})

export default defineComponent({
    components: {
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

        const { values, defineField, errors, handleSubmit, resetForm } = useForm({
            validationSchema,
            initialValues: user.value
        })

        const [email, emailAttrs] = defineField('email')
        const [name, nameAttrs] = defineField('name')
        const [password, passwordAttrs] = defineField('password')
        const [cedula, cedulaAttrs] = defineField('cedula')
        const [active, activeAttrs] = defineField('active')
        const [roles, rolesAttrs] = defineField('roles')

        const onSubmit = handleSubmit((value) => {
            console.log({ value })
        })

        watchEffect(() => {
            if (isError.value && !isLoading.value) {
                router.replace('/')
            }
        })

        watch(
            user,
            () => {
                if (!user) return

                resetForm({
                    values: user.value
                })
            },
            {
                deep: true,
                immediate: true
            }
        )

        return {
            user,
            values,
            errors,

            email,
            emailAttrs,
            name,
            nameAttrs,
            password,
            passwordAttrs,
            cedula,
            cedulaAttrs,
            active,
            activeAttrs,
            roles,
            rolesAttrs,

            onSubmit
        }
    }
})

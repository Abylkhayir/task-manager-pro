import { ref, reactive } from 'vue'

export function useForm(initialState = {}, ) {
  const formRef = ref(null)
  const formState = reactive({ ...initialState })
  const errors = ref({})
  const isSubmitting = ref(false)

  const validate = async () => {
    if (!formRef.value) return false
    
    try {
      await formRef.value.validate()
      return true
    } catch (error) {
      console.error('Form validation failed:', error)
      return false
    }
  }

  const reset = () => {
    Object.assign(formState, initialState)
    errors.value = {}
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }

  const setFieldValue = (field, value) => {
    formState[field] = value
  }

  const setFieldsValue = (values) => {
    Object.assign(formState, values)
  }

  const getFieldValue = (field) => {
    return formState[field]
  }

  return {
    formRef,
    formState,
    errors,
    isSubmitting,
    validate,
    reset,
    setFieldValue,
    setFieldsValue,
    getFieldValue
  }
}

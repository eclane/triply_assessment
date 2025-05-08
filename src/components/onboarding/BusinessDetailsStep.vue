<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  useOnboardingStore,
  businessDetailsSchema,
  companySizes,
  industries,
} from '@/stores/onboarding'

const onboardingStore = useOnboardingStore()
const { businessDetails, nextStep, prevStep } = onboardingStore

// Form validation
const errors = ref<Record<string, string>>({})

const validateField = (field: keyof typeof businessDetails) => {
  const schema = businessDetailsSchema.shape[field]
  const result = schema.safeParse(businessDetails[field])

  if (!result.success) {
    errors.value[field] = result.error.errors[0]?.message || `Invalid ${field}`
  } else {
    delete errors.value[field]
  }
}

const validateForm = () => {
  const result = businessDetailsSchema.safeParse(businessDetails)

  if (!result.success) {
    // Extract error messages for each field
    result.error.errors.forEach((err) => {
      const field = err.path[0] as keyof typeof businessDetails
      errors.value[field] = err.message
    })
    return false
  }

  return true
}

// Logo file handling
const logoInputRef = ref<HTMLInputElement | null>(null)

const handleLogoChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    businessDetails.businessLogo = file
    validateField('businessLogo')
  }
}

const removeLogo = () => {
  businessDetails.businessLogo = null
  if (logoInputRef.value) {
    logoInputRef.value.value = ''
  }
  delete errors.value.businessLogo
}

// Document file handling
const documentInputRef = ref<HTMLInputElement | null>(null)

const handleDocumentChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    businessDetails.businessDocument = file
    validateField('businessDocument')
  }
}

const removeDocument = () => {
  businessDetails.businessDocument = null
  if (documentInputRef.value) {
    documentInputRef.value.value = ''
  }
  delete errors.value.businessDocument
}

// Preview image
const logoPreview = computed(() => {
  if (businessDetails.businessLogo) {
    return URL.createObjectURL(businessDetails.businessLogo)
  }
  return null
})

// Handle form submission
const handleSubmit = () => {
  if (validateForm()) {
    nextStep()
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div class="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div
            class="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3"
          >
            <span class="text-primary-600 text-sm">1</span>
          </div>
          <h3 class="text-sm font-medium text-gray-700">Function</h3>
          <p class="ml-2 text-xs text-gray-500">Primary role and specialisations</p>
        </div>

        <div class="p-4 space-y-4">
          <div>
            <label for="businessName" class="block text-sm font-medium text-gray-700 mb-1"
              >Business Name</label
            >
            <input
              id="businessName"
              v-model="businessDetails.businessName"
              type="text"
              @blur="validateField('businessName')"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              :class="{ 'border-red-500': errors.businessName }"
              placeholder="Enter business name"
            />
            <p v-if="errors.businessName" class="mt-1 text-sm text-red-600">
              {{ errors.businessName }}
            </p>
          </div>

          <div>
            <label for="industry" class="block text-sm font-medium text-gray-700 mb-1"
              >Industry</label
            >
            <div class="relative">
              <select
                id="industry"
                v-model="businessDetails.industry"
                @blur="validateField('industry')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 appearance-none"
                :class="{ 'border-red-500': errors.industry }"
              >
                <option value="" disabled>Select an industry</option>
                <option v-for="industry in industries" :key="industry.id" :value="industry.id">
                  {{ industry.name }}
                </option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="none"
                  ></path>
                </svg>
              </div>
            </div>
            <p v-if="errors.industry" class="mt-1 text-sm text-red-600">{{ errors.industry }}</p>
          </div>

          <div>
            <label for="companySize" class="block text-sm font-medium text-gray-700 mb-1"
              >Company Size</label
            >
            <div class="relative">
              <select
                id="companySize"
                v-model="businessDetails.companySize"
                @blur="validateField('companySize')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 appearance-none"
                :class="{ 'border-red-500': errors.companySize }"
              >
                <option value="" disabled>Select company size</option>
                <option v-for="size in companySizes" :key="size.value" :value="size.value">
                  {{ size.label }}
                </option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="none"
                  ></path>
                </svg>
              </div>
            </div>
            <p v-if="errors.companySize" class="mt-1 text-sm text-red-600">
              {{ errors.companySize }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div class="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div
            class="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3"
          >
            <span class="text-primary-600 text-sm">2</span>
          </div>
          <h3 class="text-sm font-medium text-gray-700">Business Logo</h3>
          <p class="ml-2 text-xs text-gray-500">Upload company brand logo</p>
        </div>

        <div class="p-4">
          <div>
            <div
              v-if="!businessDetails.businessLogo"
              class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            >
              <div class="space-y-1 text-center">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label
                    for="business-logo"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                  >
                    <span>Upload a logo</span>
                    <input
                      id="business-logo"
                      ref="logoInputRef"
                      type="file"
                      class="sr-only"
                      accept="image/*"
                      @change="handleLogoChange"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">Any image format</p>
              </div>
            </div>

            <div v-else class="mt-1">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-16 w-16 rounded overflow-hidden bg-gray-100">
                  <img
                    v-if="logoPreview"
                    :src="logoPreview"
                    alt="Logo preview"
                    class="h-full w-full object-contain"
                  />
                </div>
                <div class="ml-4 flex">
                  <button
                    type="button"
                    @click="removeLogo"
                    class="text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p v-if="errors.businessLogo" class="mt-1 text-sm text-red-600">
                {{ errors.businessLogo }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div class="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div
            class="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3"
          >
            <span class="text-primary-600 text-sm">3</span>
          </div>
          <h3 class="text-sm font-medium text-gray-700">Business Document</h3>
          <p class="ml-2 text-xs text-gray-500">Upload business license or registration</p>
        </div>

        <div class="p-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Business Document (PDF only, max 5MB)</label
            >

            <div
              v-if="!businessDetails.businessDocument"
              class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            >
              <div class="space-y-1 text-center">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label
                    for="business-document"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                  >
                    <span>Upload a document</span>
                    <input
                      id="business-document"
                      ref="documentInputRef"
                      type="file"
                      class="sr-only"
                      accept="application/pdf"
                      @change="handleDocumentChange"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">PDF up to 5MB</p>
              </div>
            </div>

            <div v-else class="mt-1">
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded flex items-center justify-center"
                >
                  <svg
                    class="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div class="ml-4 flex-1">
                  <div class="text-sm font-medium text-gray-900">
                    {{ businessDetails.businessDocument.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ Math.round(businessDetails.businessDocument.size / 1024) }} KB
                  </div>
                </div>
                <div class="ml-4">
                  <button
                    type="button"
                    @click="removeDocument"
                    class="text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p v-if="errors.businessDocument" class="mt-1 text-sm text-red-600">
                {{ errors.businessDocument }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between pt-4">
        <button
          type="button"
          @click="prevStep"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  </div>
</template>

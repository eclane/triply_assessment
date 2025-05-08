<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOnboardingStore, personalDetailsSchema } from '@/stores/onboarding'

const onboardingStore = useOnboardingStore()
const { personalDetails, nextStep } = onboardingStore

// Form validation
const errors = ref<Record<string, string>>({})

const validateField = (field: keyof typeof personalDetails) => {
  const schema = personalDetailsSchema.shape[field]
  const result = schema.safeParse(personalDetails[field])

  if (!result.success) {
    errors.value[field] = result.error.errors[0]?.message || `Invalid ${field}`
  } else {
    delete errors.value[field]
  }
}

const validateForm = () => {
  const result = personalDetailsSchema.safeParse(personalDetails)

  if (!result.success) {
    // Extract error messages for each field
    result.error.errors.forEach((err) => {
      const field = err.path[0] as keyof typeof personalDetails
      errors.value[field] = err.message
    })
    return false
  }

  return true
}

// File handling
const fileInputRef = ref<HTMLInputElement | null>(null)

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    personalDetails.profileImage = file
    validateField('profileImage')
  }
}

const removeFile = () => {
  personalDetails.profileImage = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  delete errors.value.profileImage
}

// Preview image
const imagePreview = computed(() => {
  if (personalDetails.profileImage) {
    return URL.createObjectURL(personalDetails.profileImage)
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
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              id="name"
              v-model="personalDetails.name"
              type="text"
              @blur="validateField('name')"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              :class="{ 'border-red-500': errors.name }"
              placeholder="Enter full name"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              v-model="personalDetails.email"
              type="email"
              @blur="validateField('email')"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              :class="{ 'border-red-500': errors.email }"
              placeholder="email@example.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1"
              >Phone Number</label
            >
            <input
              id="phone"
              v-model="personalDetails.phone"
              type="tel"
              @blur="validateField('phone')"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              :class="{ 'border-red-500': errors.phone }"
              placeholder="+1 (555) 123-4567"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
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
          <h3 class="text-sm font-medium text-gray-700">Profile Image</h3>
          <p class="ml-2 text-xs text-gray-500">Upload user profile photo</p>
        </div>

        <div class="p-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Profile Image (JPG/PNG, max 2MB)</label
            >

            <div
              v-if="!personalDetails.profileImage"
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
                    for="profile-image"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="profile-image"
                      ref="fileInputRef"
                      type="file"
                      class="sr-only"
                      accept="image/jpeg,image/png"
                      @change="handleFileChange"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">JPG, PNG up to 2MB</p>
              </div>
            </div>

            <div v-else class="mt-1">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                  <img
                    v-if="imagePreview"
                    :src="imagePreview"
                    alt="Profile preview"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div class="ml-4 flex">
                  <button
                    type="button"
                    @click="removeFile"
                    class="text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p v-if="errors.profileImage" class="mt-1 text-sm text-red-600">
                {{ errors.profileImage }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4">
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

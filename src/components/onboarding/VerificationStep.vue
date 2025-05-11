<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore, verificationSchema, industries, companySizes } from '@/stores/onboarding'

const router = useRouter()
const {
  personalDetails,
  businessDetails,
  verification,
  prevStep,
  isLoading,
  apiError,
  sendVerificationCode,
  verifyCode,
  submitOnboardingData,
} = useOnboardingStore()

// Form validation
const errors = ref<Record<string, string>>({})
const codeSent = ref(false)
const showSummary = ref(false)
const isSubmitting = ref(false)

const validateCode = () => {
  const result = verificationSchema.safeParse({ verificationCode: verification.verificationCode })

  if (!result.success) {
    errors.value.verificationCode = result.error.errors[0]?.message || 'Invalid verification code'
    return false
  }

  delete errors.value.verificationCode
  return true
}

// Send verification code
const handleSendCode = async () => {
  const success = await sendVerificationCode(personalDetails.email)
  if (success) {
    codeSent.value = true
  }
}

// Verify code
const handleVerifyCode = async () => {
  if (!validateCode()) return

  const success = await verifyCode(verification.verificationCode)
  if (success) {
    showSummary.value = true
  }
}

// Format file size
const formatFileSize = (bytes: number | null | undefined) => {
  if (!bytes) return 'N/A'

  if (bytes < 1024) return bytes + ' bytes'
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Helper functions for type-safe lookups
const findIndustryName = (industryId: string) => {
  return industries.find(i => i.id === industryId)?.name || industryId
}

const findCompanySizeLabel = (sizeValue: string) => {
  return companySizes.find(s => s.value === sizeValue)?.label || sizeValue
}

// Create object URLs for images
const getObjectURL = (file: File | null) => {
  if (!file) return ''
  return URL.createObjectURL(file)
}

const profileImageURL = computed(() => {
  return personalDetails.profileImage ? getObjectURL(personalDetails.profileImage) : ''
})

const businessLogoURL = computed(() => {
  return businessDetails.businessLogo ? getObjectURL(businessDetails.businessLogo) : ''
})

// Submit onboarding data
const submitOnboarding = async () => {
  isSubmitting.value = true
  try {
    const success = await submitOnboardingData()
    if (success) {
      router.push('/success')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div v-if="!codeSent" class="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
    <div class="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
      <div
        class="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3"
      >
        <span class="text-primary-600 text-sm">1</span>
      </div>
      <h3 class="text-sm font-medium text-gray-700">Verification</h3>
      <p class="ml-2 text-xs text-gray-500">Security clearance levels & restrictions</p>
    </div>

    <div class="p-4 space-y-6">
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-yellow-700">
              We need to verify your email address. Click the button below to receive a verification
              code.
            </p>
          </div>
        </div>
      </div>

      <button
        @click="handleSendCode"
        :disabled="isLoading"
        class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">Sending...</span>
        <span v-else>Send Verification Code</span>
      </button>
    </div>
  </div>

  <div
    v-else-if="!verification.verified"
    class="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6"
  >
    <div class="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
      <div
        class="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3"
      >
        <span class="text-primary-600 text-sm">2</span>
      </div>
      <h3 class="text-sm font-medium text-gray-700">Verification Code</h3>
      <p class="ml-2 text-xs text-gray-500">Enter the code sent to your email</p>
    </div>

    <div class="p-4 space-y-6">
      <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-700">
              A verification code has been sent to <strong>{{ personalDetails.email }}</strong
              >. Please enter it below.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label for="verificationCode" class="block text-sm font-medium text-gray-700 mb-1"
          >Verification Code</label
        >
        <input
          id="verificationCode"
          v-model="verification.verificationCode"
          type="text"
          maxlength="6"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          :class="{ 'border-red-500': errors.verificationCode }"
          placeholder="Enter 6-digit code"
        />
        <p v-if="errors.verificationCode" class="mt-1 text-sm text-red-600">
          {{ errors.verificationCode }}
        </p>
      </div>

      <div v-if="apiError" class="bg-red-50 border-l-4 border-red-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ apiError }}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-between">
        <button
          @click="handleSendCode"
          :disabled="isLoading"
          class="text-sm text-primary-600 hover:text-primary-500"
        >
          Resend Code
        </button>

        <button
          @click="handleVerifyCode"
          :disabled="isLoading || !verification.verificationCode"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Verifying...</span>
          <span v-else>Verify Code</span>
        </button>
      </div>
    </div>
  </div>

  <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
    <div class="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
      <div
        class="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3"
      >
        <span class="text-primary-600 text-sm">3</span>
      </div>
      <h3 class="text-sm font-medium text-gray-700">Review & Confirm</h3>
      <p class="ml-2 text-xs text-gray-500">Verify and submit invitation</p>
    </div>

    <div class="p-4 space-y-6">
      <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-700">
              Email verified successfully! Please review your information below before submitting.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">Name</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ personalDetails.name }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ personalDetails.email }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Phone</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ personalDetails.phone }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Profile Image</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <div v-if="personalDetails.profileImage" class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                    <img
                      :src="profileImageURL"
                      alt="Profile preview"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">
                      {{ personalDetails.profileImage.name }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ formatFileSize(personalDetails.profileImage.size) }}
                    </p>
                  </div>
                </div>
                <span v-else>No image uploaded</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div class="px-4 py-5 sm:px-6 bg-gray-50">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Business Information</h3>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt class="text-sm font-medium text-gray-500">Business Name</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ businessDetails.businessName }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Industry</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ findIndustryName(businessDetails.industry) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Company Size</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ findCompanySizeLabel(businessDetails.companySize) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Business Logo</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <div v-if="businessDetails.businessLogo" class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-100">
                  <img
                    :src="businessLogoURL"
                    alt="Logo preview"
                    class="h-full w-full object-contain"
                  />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ businessDetails.businessLogo.name }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ formatFileSize(businessDetails.businessLogo.size) }}
                  </p>
                </div>
              </div>
              <span v-else>No logo uploaded</span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Business Document</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <div v-if="businessDetails.businessDocument" class="flex items-center">
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
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ businessDetails.businessDocument.name }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ formatFileSize(businessDetails.businessDocument.size) }}
                  </p>
                </div>
              </div>
              <span v-else>No document uploaded</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="flex justify-between pt-4">
      <button
        type="button"
        @click="$emit('prev-step')"
        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
      >
        Back
      </button>
      <button
        @click="submitOnboarding"
        :disabled="isSubmitting"
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isSubmitting">Submitting...</span>
        <span v-else>Send Invites</span>
      </button>
    </div>
  </div>
</template>

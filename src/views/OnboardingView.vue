<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding'
import PersonalDetailsStep from '@/components/onboarding/PersonalDetailsStep.vue'
import BusinessDetailsStep from '@/components/onboarding/BusinessDetailsStep.vue'
import VerificationStep from '@/components/onboarding/VerificationStep.vue'
import StepIndicator from '@/components/onboarding/StepIndicator.vue'

const router = useRouter()
const onboardingStore = useOnboardingStore()

// Load saved data from localStorage on component mount
onMounted(() => {
  onboardingStore.loadFromLocalStorage()

  // Auto-save to localStorage whenever form data changes
  watch(
    [
      () => onboardingStore.currentStep,
      () => onboardingStore.personalDetails,
      () => onboardingStore.businessDetails,
      () => onboardingStore.verification,
    ],
    () => {
      onboardingStore.saveToLocalStorage()
    },
    { deep: true },
  )
})

// Handle form submission
const handleSubmit = async () => {
  const success = await onboardingStore.submitOnboardingData()
  if (success) {
    router.push('/success')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="flex-grow flex">
      <div class="w-full max-w-7xl mx-auto px-4 py-12 flex">
        <div class="w-1/4 pr-8">
          <StepIndicator
            :current-step="onboardingStore.currentStep"
            :total-steps="onboardingStore.totalSteps"
          />
        </div>

        <div class="w-3/4">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 class="text-2xl font-bold mb-6">User Onboarding</h1>
            <div>
              <PersonalDetailsStep v-if="onboardingStore.currentStep === 1" />
              <BusinessDetailsStep v-if="onboardingStore.currentStep === 2" />
              <VerificationStep v-if="onboardingStore.currentStep === 3" @submit="handleSubmit" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

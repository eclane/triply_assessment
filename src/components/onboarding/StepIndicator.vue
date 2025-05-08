<script setup lang="ts">
import { computed } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding'

const props = defineProps<{
  currentStep: number
  totalSteps: number
}>()

const onboardingStore = useOnboardingStore()

const steps = [
  {
    number: 1,
    title: 'Personal Details',
    isComplete: computed(() => onboardingStore.isPersonalDetailsValid),
  },
  {
    number: 2,
    title: 'Business Details',
    isComplete: computed(() => onboardingStore.isBusinessDetailsValid),
  },
  {
    number: 3,
    title: 'Verification',
    isComplete: computed(() => onboardingStore.isVerificationValid),
  },
  { number: 4, title: 'Review & Confirm', isComplete: computed(() => false) },
]

const getStepDescription = (stepNumber: number) => {
  switch (stepNumber) {
    case 1:
      return 'Add your personal details'
    case 2:
      return 'Add your business details'
    case 3:
      return 'Verify your email address'
    case 4:
      return 'Review and confirm'
    default:
      return ''
  }
}

const handleStepClick = (stepNumber: number) => {
  if (stepNumber <= props.currentStep) {
    onboardingStore.goToStep(stepNumber)
  }
}
</script>

<template>
  <div class="py-4">
    <div class="flex flex-col space-y-8">
      <div v-for="step in steps" :key="step.number" class="flex items-start">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center mr-4 cursor-pointer flex-shrink-0"
          :class="{
            'bg-green-500 text-white':
              step.number < currentStep || (step.number === currentStep && step.isComplete.value),
            'bg-primary-600 text-white': step.number === currentStep && !step.isComplete.value,
            'bg-gray-200 text-gray-600': step.number > currentStep,
          }"
          @click="handleStepClick(step.number)"
        >
          <span
            v-if="
              step.number < currentStep || (step.number === currentStep && step.isComplete.value)
            "
            class="text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          <span v-else class="text-sm">{{ step.number }}</span>
        </div>

        <div class="flex-1">
          <div class="flex justify-between items-center mb-1">
            <span
              class="font-medium"
              :class="{
                'text-green-600':
                  step.number < currentStep ||
                  (step.number === currentStep && step.isComplete.value),
                'text-primary-600': step.number === currentStep && !step.isComplete.value,
                'text-gray-500': step.number > currentStep,
              }"
            >
              {{ step.title }}
            </span>

            <span
              v-if="step.number === currentStep && step.isComplete.value"
              class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
            >
              Complete
            </span>
          </div>

          <p class="text-sm text-gray-500">
            {{ getStepDescription(step.number) }}
          </p>
          <div
            v-if="step.number < steps.length"
            class="ml-4 mt-2 mb-2 w-0.5 h-6 bg-gray-200"
            :class="{
              'bg-green-500': step.number < currentStep,
              'bg-gray-200': step.number >= currentStep,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding'

const router = useRouter()
const onboardingStore = useOnboardingStore()

const startOver = () => {
  onboardingStore.clearLocalStorage()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="flex-grow flex items-center justify-center">
      <div class="w-full max-w-2xl px-4">
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <div
            class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10 text-green-600"
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
          </div>

          <h1 class="text-2xl font-bold mb-4">Onboarding Complete!</h1>
          <p class="text-gray-600 mb-8">Your onboarding has been successfully completed.</p>

          <button
            @click="startOver"
            class="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useOnboardingStore } from '@/stores/onboarding'

// Initialize stores
const dashboardStore = useDashboardStore()
const onboardingStore = useOnboardingStore()

// Destructure store properties for easier access in the template
const {
  profileCompletion,
  profileSections,
  transactionSuccessRate,
  currentMonth,
  weeklyData,
  transactions,
  spendingCategories,
  transactionVolumeIncrease,
  previousMonth,
  securityFeatures,
  totalSpending
} = dashboardStore

// Loading state
const isLoading = ref(false)

// Fetch dashboard data on component mount
onMounted(async () => {
  isLoading.value = true
  try {
    await dashboardStore.fetchDashboardData()
    
    // If user completed onboarding, update security feature
    if (onboardingStore.verification.verified) {
      dashboardStore.updateSecurityFeature('Verify email', true)
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-700">Loading dashboard data...</p>
      </div>
    </div>
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-900">FinGuard</h1>
            </div>
            <nav class="ml-8 flex space-x-4">
              <a href="#" class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Overview</a>
              <a href="#" class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Operations</a>
              <a href="#" class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Security Center</a>
              <a href="#" class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Activity</a>
              <a href="#" class="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-800">Reports</a>
            </nav>
          </div>
          <div class="flex items-center">
            <button type="button" class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <span class="sr-only">View notifications</span>
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div class="ml-3 relative">
              <div>
                <button type="button" class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <span class="sr-only">Open user menu</span>
                  <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 md:col-span-4 bg-primary-600 rounded-lg p-6 text-white relative overflow-hidden">
          <div class="z-10 relative">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mb-4">
              Findings
            </span>
            <h2 class="text-2xl font-bold mt-8">Your Transaction Volume has Increased by {{ transactionVolumeIncrease }}% Since {{ previousMonth }}</h2>
          </div>
          <div class="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" class="absolute top-0 left-0 w-full h-full">
              <path d="M203.5,26C121.4,26,55,92.4,55,174.5S121.4,323,203.5,323S352,256.6,352,174.5S285.6,26,203.5,26z" fill="none" stroke="currentColor" stroke-width="2"></path>
              <path d="M203.5,26C121.4,26,55,92.4,55,174.5S121.4,323,203.5,323S352,256.6,352,174.5S285.6,26,203.5,26z" fill="none" stroke="currentColor" stroke-width="2" transform="rotate(60 203.5 174.5)"></path>
              <path d="M203.5,26C121.4,26,55,92.4,55,174.5S121.4,323,203.5,323S352,256.6,352,174.5S285.6,26,203.5,26z" fill="none" stroke="currentColor" stroke-width="2" transform="rotate(120 203.5 174.5)"></path>
            </svg>
          </div>
          <div class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <div class="col-span-12 md:col-span-4 bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900">Profile Completion</h2>
            <div class="mt-2 flex items-baseline">
              <p class="text-4xl font-bold text-gray-900">{{ profileCompletion }}%</p>
              <p class="ml-2 text-sm text-gray-500">You're almost there!</p>
            </div>
            <div class="mt-4 space-y-2">
              <div v-for="(section, index) in profileSections" :key="index" class="w-full bg-gray-200 rounded-full h-2">
                <div :class="{
                  'bg-primary-600': index === 0,
                  'bg-orange-500': index === 1,
                  'bg-blue-200': index === 2
                }" class="h-2 rounded-full" :style="{ width: `${profileCompletion * section.percentage}%` }"></div>
              </div>
            </div>
            <div class="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div v-for="(section, index) in profileSections" :key="index" class="text-gray-700">
                {{ section.name }}
              </div>
            </div>
            <div class="mt-6">
              <p class="text-sm text-gray-700 mb-2">Secure your account further by:</p>
              <div v-for="feature in securityFeatures" :key="feature.name" class="flex items-center justify-between bg-gray-50 p-3 rounded-md mb-2">
                <div class="flex items-center">
                  <svg v-if="feature.icon === 'email'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <svg v-else-if="feature.icon === 'lock'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span class="text-sm text-gray-700">{{ feature.name }}</span>
                </div>
                <span v-if="feature.completed" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
                <button v-else @click="dashboardStore.updateSecurityFeature(feature.name, true)" class="text-primary-600 hover:text-primary-700 text-sm font-medium focus:outline-none">
                  Enable
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-12 md:col-span-4 bg-white rounded-lg shadow overflow-hidden">
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Transaction Success Rate</h2>
            <button class="text-gray-400 hover:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="p-6">
            <div class="flex items-baseline">
              <p class="text-4xl font-bold text-gray-900">{{ transactionSuccessRate }}%</p>
              <p class="ml-2 text-sm text-gray-500">Retry success rate</p>
            </div>
            <div class="mt-6 relative h-40">
              <div class="absolute inset-0 flex items-end justify-between">
                <div v-for="(item, index) in weeklyData" :key="index" class="w-8 bg-gray-100 rounded-t-md" :style="{ height: `${item.rate}%` }">
                  <div v-if="index === 4" class="w-full bg-orange-500 h-full rounded-t-md relative">
                    <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded">
                      67%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-2 grid grid-cols-7 gap-2 text-center text-xs text-gray-500">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>
          </div>
        </div>

        <div class="col-span-12 md:col-span-7 bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium text-gray-900">Transaction History</h2>
              <div class="text-sm text-gray-500">Nov 5, 2024 - Nov 7, 2024</div>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="transaction in transactions" :key="transaction.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img v-if="transaction.icon === 'netflix'" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png" alt="Netflix" class="h-6 w-auto" />
                        <div v-else-if="transaction.icon === 'lightroom'" class="bg-blue-800 text-white font-bold text-xs h-full w-full flex items-center justify-center">Lr</div>
                        <div v-else-if="transaction.icon === 'mobbin'" class="bg-black text-white font-bold text-xs h-full w-full flex items-center justify-center">Mb</div>
                        <div v-else-if="transaction.icon === 'figma'" class="bg-black h-full w-full flex items-center justify-center">
                          <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9C6 7.34315 7.34315 6 9 6C10.6569 6 12 7.34315 12 9C12 10.6569 10.6569 12 9 12C7.34315 12 6 10.6569 6 9Z" fill="#1ABCFE"/>
                            <path d="M0 15C0 13.3431 1.34315 12 3 12H6V15C6 16.6569 4.65685 18 3 18C1.34315 18 0 16.6569 0 15Z" fill="#0ACF83"/>
                            <path d="M6 0V6H9C10.6569 6 12 4.65685 12 3C12 1.34315 10.6569 0 9 0H6Z" fill="#FF7262"/>
                            <path d="M0 3C0 4.65685 1.34315 6 3 6H6V0H3C1.34315 0 0 1.34315 0 3Z" fill="#F24E1E"/>
                            <path d="M0 9C0 10.6569 1.34315 12 3 12H6V6H3C1.34315 6 0 7.34315 0 9Z" fill="#A259FF"/>
                          </svg>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ transaction.merchant }}</div>
                        <div class="text-sm text-gray-500">{{ transaction.date }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div :class="`w-2 h-2 rounded-full ${transaction.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'} mr-2`"></div>
                      <span class="text-sm text-gray-500">{{ transaction.status }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ transaction.type }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    - ${{ transaction.amount.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-gray-400 hover:text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="col-span-12 md:col-span-5 bg-white rounded-lg shadow overflow-hidden">
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Spending Overview</h2>
            <div class="relative">
              <button class="flex items-center text-sm text-gray-700">
                {{ currentMonth }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6">
            <div class="flex items-end space-x-4 h-48">
              <div v-for="(category, index) in spendingCategories" :key="index" class="flex-1 relative">
                <div class="absolute inset-x-0 bottom-0 rounded-md" :class="{ 'bg-primary-600': index === 0, 'bg-blue-200': index !== 0 }" :style="{ height: `${category.percentage}%` }">
                  <div v-if="index === 0" class="absolute inset-0 bg-primary-600 bg-opacity-50 rounded-md" style="background-image: linear-gradient(135deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent); background-size: 10px 10px;"></div>
                  <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                    {{ category.percentage }}%
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 space-y-3">
              <div v-for="(category, index) in spendingCategories" :key="index" class="flex items-center">
                <div :class="`w-3 h-3 rounded-sm ${index === 0 ? 'bg-primary-600' : 'bg-blue-200'} mr-2`"></div>
                <span class="text-sm text-gray-700">{{ category.name }}</span>
                <span v-if="index === 0" class="ml-2 text-xs bg-gray-900 text-white px-2 py-0.5 rounded">Health & wellness</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>


import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import VerificationStep from '../onboarding/VerificationStep.vue'
import type { Mock } from 'vitest'
import { useOnboardingStore } from '../../stores/onboarding'

// Mock the router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

// Mock the onboarding store
vi.mock('../../stores/onboarding', () => {
  // Create mock functions
  const sendVerificationCode = vi.fn().mockResolvedValue(true)
  const verifyCode = vi.fn().mockResolvedValue(true)
  const submitOnboardingData = vi.fn().mockResolvedValue(true)
  
  return {
    useOnboardingStore: vi.fn(() => ({
      personalDetails: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890'
      },
      businessDetails: {
        businessName: 'Acme Inc',
        industry: 'tech',
        companySize: '11-50'
      },
      verification: {
        verificationCode: '',
        verified: false
      },
      isLoading: false,
      apiError: '',
      sendVerificationCode,
      verifyCode,
      submitOnboardingData
    })),
    industries: [
      { id: 'tech', name: 'Technology' }
    ],
    companySizes: [
      { value: '11-50', label: '11-50 employees' }
    ],
    verificationSchema: {
      safeParse: vi.fn(() => ({ success: true }))
    }
  }
})

describe('VerificationStep', () => {
  // Get mocked store functions for assertions
  let mockStore: {
    sendVerificationCode: Mock
    verifyCode: Mock
    submitOnboardingData: Mock
  }
  
  beforeEach(() => {
    // Create a fresh pinia instance and make it active
    setActivePinia(createPinia())
    
    // Reset mocks
    vi.resetAllMocks()
    
    // Get mock functions from the store for assertions
    mockStore = vi.mocked(useOnboardingStore())
  })

  it('renders initial verification step correctly', () => {
    const wrapper = mount(VerificationStep)
    
    // Should show the initial verification step with send code button
    expect(wrapper.text()).toContain('We need to verify your email address')
    expect(wrapper.find('button').text()).toContain('Send Verification Code')
  })

  it('calls sendVerificationCode when button is clicked', async () => {
    const wrapper = mount(VerificationStep)
    
    // Click the send code button
    await wrapper.find('button').trigger('click')
    await flushPromises()
    
    // Should have called the sendVerificationCode function
    expect(mockStore.sendVerificationCode).toHaveBeenCalled()
  })

  it('shows loading state when isLoading is true', async () => {
    // Update the mock store to have isLoading=true
    vi.mocked(useOnboardingStore).mockReturnValue({
      ...useOnboardingStore(),
      isLoading: true
    })
    
    const wrapper = mount(VerificationStep)
    
    // Should show loading state in the button
    expect(wrapper.find('button').text()).toContain('Sending...')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})

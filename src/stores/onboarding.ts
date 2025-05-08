import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { z } from 'zod'

// Define validation schemas using zod
export const personalDetailsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  profileImage: z.instanceof(File).optional()
    .refine(file => !file || file.size <= 2 * 1024 * 1024, {
      message: 'Profile image must be less than 2MB'
    })
    .refine(file => !file || ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'Profile image must be JPG or PNG'
    })
})

export const businessDetailsSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  companySize: z.string().min(1, 'Please select a company size'),
  businessLogo: z.instanceof(File).optional()
    .refine(file => !file || file.size <= 5 * 1024 * 1024, {
      message: 'Business logo must be less than 5MB'
    }),
  businessDocument: z.instanceof(File).optional()
    .refine(file => !file || file.size <= 5 * 1024 * 1024, {
      message: 'Business document must be less than 5MB'
    })
    .refine(file => !file || file.type === 'application/pdf', {
      message: 'Business document must be a PDF file'
    })
})

export const verificationSchema = z.object({
  verificationCode: z.string().length(6, 'Verification code must be 6 digits')
})

// Company size options
export const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' }
]

export const industries = [
  { id: 'tech', name: 'Technology' },
  { id: 'finance', name: 'Finance' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'education', name: 'Education' },
  { id: 'retail', name: 'Retail' },
  { id: 'manufacturing', name: 'Manufacturing' },
  { id: 'services', name: 'Professional Services' }
]

export const useOnboardingStore = defineStore('onboarding', () => {
  // Current step
  const currentStep = ref(1)
  const totalSteps = 3

  // Form data
  const personalDetails = ref({
    name: '',
    email: '',
    phone: '',
    profileImage: null as File | null
  })

  const businessDetails = ref({
    businessName: '',
    industry: '',
    companySize: '',
    businessLogo: null as File | null,
    businessDocument: null as File | null
  })

  const verification = ref({
    verificationCode: '',
    sentCode: '',
    verified: false
  })

  // Loading states
  const isLoading = ref(false)
  const apiError = ref('')

  const sendVerificationCode = async (email: string) => {
    isLoading.value = true
    apiError.value = ''
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      verification.value.sentCode = code
      
      console.log(`Verification code sent to ${email}: ${code}`)
      return true
    } catch (error) {
      apiError.value = 'Failed to send verification code. Please try again.'
      console.error('Error sending verification code:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const verifyCode = async (code: string) => {
    isLoading.value = true
    apiError.value = ''
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if the code matches
      const isValid = code === verification.value.sentCode
      verification.value.verified = isValid
      
      if (!isValid) {
        apiError.value = 'Invalid verification code. Please try again.'
      }
      
      return isValid
    } catch (error) {
      apiError.value = 'Failed to verify code. Please try again.'
      console.error('Error verifying code:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const submitOnboardingData = async () => {
    isLoading.value = true
    apiError.value = ''
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Prepare data for submission (in a real app, we'd use FormData for files)
      const submissionData = {
        personal: {
          name: personalDetails.value.name,
          email: personalDetails.value.email,
          phone: personalDetails.value.phone,
          profileImage: personalDetails.value.profileImage ? personalDetails.value.profileImage.name : null
        },
        business: {
          businessName: businessDetails.value.businessName,
          industry: businessDetails.value.industry,
          companySize: businessDetails.value.companySize,
          businessLogo: businessDetails.value.businessLogo ? businessDetails.value.businessLogo.name : null,
          businessDocument: businessDetails.value.businessDocument ? businessDetails.value.businessDocument.name : null
        },
        verification: {
          verified: verification.value.verified
        }
      }
      
      console.log('Submitting onboarding data:', submissionData)
      return true
    } catch (error) {
      apiError.value = 'Failed to submit onboarding data. Please try again.'
      console.error('Error submitting onboarding data:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Navigation functions
  const nextStep = () => {
    if (currentStep.value < totalSteps) {
      currentStep.value++
    }
  }

  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      currentStep.value = step
    }
  }

  // Computed properties for validation
  const isPersonalDetailsValid = computed(() => {
    const result = personalDetailsSchema.safeParse(personalDetails.value)
    return result.success
  })

  const isBusinessDetailsValid = computed(() => {
    const result = businessDetailsSchema.safeParse(businessDetails.value)
    return result.success
  })

  const isVerificationValid = computed(() => {
    return verification.value.verified
  })

  // LocalStorage persistence
  const saveToLocalStorage = () => {
    const dataToSave = {
      currentStep: currentStep.value,
      personalDetails: {
        name: personalDetails.value.name,
        email: personalDetails.value.email,
        phone: personalDetails.value.phone,
        // We can't store File objects in localStorage, so we'll just save a flag
        hasProfileImage: !!personalDetails.value.profileImage
      },
      businessDetails: {
        businessName: businessDetails.value.businessName,
        industry: businessDetails.value.industry,
        companySize: businessDetails.value.companySize,
        hasBusinessLogo: !!businessDetails.value.businessLogo,
        hasBusinessDocument: !!businessDetails.value.businessDocument
      },
      verification: {
        verified: verification.value.verified
      }
    }
    
    localStorage.setItem('onboardingData', JSON.stringify(dataToSave))
  }

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem('onboardingData')
    
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        
        // Restore data (except for files which can't be stored in localStorage)
        currentStep.value = data.currentStep || 1
        
        if (data.personalDetails) {
          personalDetails.value.name = data.personalDetails.name || ''
          personalDetails.value.email = data.personalDetails.email || ''
          personalDetails.value.phone = data.personalDetails.phone || ''
        }
        
        if (data.businessDetails) {
          businessDetails.value.businessName = data.businessDetails.businessName || ''
          businessDetails.value.industry = data.businessDetails.industry || ''
          businessDetails.value.companySize = data.businessDetails.companySize || ''
        }
        
        if (data.verification) {
          verification.value.verified = data.verification.verified || false
        }
        
        return true
      } catch (error) {
        console.error('Error loading onboarding data from localStorage:', error)
        return false
      }
    }
    
    return false
  }

  const clearLocalStorage = () => {
    localStorage.removeItem('onboardingData')
    
    // Reset all form data
    personalDetails.value = {
      name: '',
      email: '',
      phone: '',
      profileImage: null
    }
    
    businessDetails.value = {
      businessName: '',
      industry: '',
      companySize: '',
      businessLogo: null,
      businessDocument: null
    }
    
    verification.value = {
      verificationCode: '',
      sentCode: '',
      verified: false
    }
    
    currentStep.value = 1
  }

  return {
    // State
    currentStep,
    totalSteps,
    personalDetails,
    businessDetails,
    verification,
    isLoading,
    apiError,
    
    // API functions
    sendVerificationCode,
    verifyCode,
    submitOnboardingData,
    
    // Navigation
    nextStep,
    prevStep,
    goToStep,
    
    // Validation
    isPersonalDetailsValid,
    isBusinessDetailsValid,
    isVerificationValid,
    
    // LocalStorage
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
  // Profile completion data
  const profileCompletion = ref(87)
  const profileSections = ref([
    { name: 'Bank account details', percentage: 0.5 },
    { name: 'Credit card', percentage: 0.3 },
    { name: 'Other', percentage: 0.2 }
  ])

  // Transaction success rate data
  const transactionSuccessRate = ref(70)
  const currentMonth = ref('November')
  
  // Weekly transaction success rate data
  const weeklyData = ref([
    { day: 'Mon', rate: 45 },
    { day: 'Tue', rate: 55 },
    { day: 'Wed', rate: 48 },
    { day: 'Thu', rate: 65 },
    { day: 'Fri', rate: 78 },
    { day: 'Sat', rate: 60 },
    { day: 'Sun', rate: 68 }
  ])

  // Transaction history data
  const transactions = ref([
    {
      id: 1,
      merchant: 'Netflix',
      date: '7 Nov, 3:20 PM',
      status: 'In process',
      type: 'Subscription',
      amount: 12.00,
      icon: 'netflix'
    },
    {
      id: 2,
      merchant: 'Lightroom',
      date: '6 Nov, 12:45 PM',
      status: 'In process',
      type: 'Subscription',
      amount: 19.99,
      icon: 'lightroom'
    },
    {
      id: 3,
      merchant: 'Mobbin',
      date: '5 Nov, 6:37 PM',
      status: 'Completed',
      type: 'Subscription',
      amount: 10.00,
      icon: 'mobbin'
    },
    {
      id: 4,
      merchant: 'Figma',
      date: '5 Nov, 11:02 AM',
      status: 'Completed',
      type: 'Subscription',
      amount: 15.00,
      icon: 'figma'
    }
  ])

  // Spending overview data
  const spendingCategories = ref([
    { name: 'Health & wellness', percentage: 67 },
    { name: 'Entertainment', percentage: 53 },
    { name: 'Food & Dining', percentage: 45 },
    { name: 'Transportation', percentage: 38 }
  ])

  // Transaction volume data
  const transactionVolumeIncrease = ref(5)
  const previousMonth = ref('October')

  // Security features
  const securityFeatures = ref([
    { name: 'Verify email', completed: true, icon: 'email' },
    { name: 'Enable 2FA', completed: false, icon: 'lock' }
  ])

  // Methods to update data
  const updateProfileCompletion = (newValue: number) => {
    profileCompletion.value = newValue
  }

  const addTransaction = (transaction: any) => {
    transactions.value.unshift(transaction)
  }

  const updateTransactionStatus = (id: number, newStatus: string) => {
    const transaction = transactions.value.find(t => t.id === id)
    if (transaction) {
      transaction.status = newStatus
    }
  }

  const updateSecurityFeature = (name: string, completed: boolean) => {
    const feature = securityFeatures.value.find(f => f.name === name)
    if (feature) {
      feature.completed = completed
    }
  }

  // Computed properties
  const totalSpending = computed(() => {
    return transactions.value.reduce((total, transaction) => total + transaction.amount, 0)
  })

  const completedTransactions = computed(() => {
    return transactions.value.filter(t => t.status === 'Completed')
  })

  const pendingTransactions = computed(() => {
    return transactions.value.filter(t => t.status === 'In process')
  })

  // Mock API call to fetch dashboard data
  const fetchDashboardData = async () => {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real app, you would fetch data from an API here
    // For now, we'll just use the existing data
    return {
      profileCompletion: profileCompletion.value,
      transactionSuccessRate: transactionSuccessRate.value,
      transactions: transactions.value,
      spendingCategories: spendingCategories.value,
      weeklyData: weeklyData.value
    }
  }

  return {
    // State
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
    
    // Computed
    totalSpending,
    completedTransactions,
    pendingTransactions,
    
    // Methods
    updateProfileCompletion,
    addTransaction,
    updateTransactionStatus,
    updateSecurityFeature,
    fetchDashboardData
  }
})

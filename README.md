# Multi-Step User Onboarding Flow

A Vue 3 implementation of a multi-step user onboarding flow for a SaaS dashboard.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
yarn install
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

## Implementation Overview

This project implements a multi-step user onboarding flow with the following features:

### Component Structure
- **OnboardingView**: Main parent component that manages the overall flow
- **StepIndicator**: Shows the current step and progress through the onboarding process
- **PersonalDetailsStep**: First step collecting user personal information
- **BusinessDetailsStep**: Second step collecting business information
- **VerificationStep**: Final step for verification and data summary

### State Management
- Uses **Pinia** for global state management
- The `onboardingStore` handles:
  - Form data for all steps
  - Step navigation
  - Validation using Zod
  - Mock API interactions
  - LocalStorage persistence

### API Mocking Implementation

API calls are mocked using timeouts to simulate network requests:

1. **Verification Code**: Generates and validates a 6-digit code
2. **Form Submission**: Simulates submitting all collected data

All mock API functions include proper loading states and error handling.

### File Upload Handling

The application supports file uploads with the following restrictions:
- **Profile Image**: JPG/PNG files up to 2MB
- **Business Logo**: Any image format
- **Business Document**: PDF files up to 5MB

Validation is performed using Zod schemas to ensure files meet the requirements.

### LocalStorage Persistence

The application automatically saves form progress to localStorage, allowing users to:
- Continue from where they left off if they refresh the page
- Clear all data and start over

### Validation

Form validation is implemented using Zod with specific validation rules for each field:
- Required fields
- Email format validation
- File type and size restrictions
- Phone number format

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

export const validatePassword = (password: string): ValidationResult => {
  // 1. Check if empty
  if (!password || password.trim() === '') {
    return { isValid: false, errorMessage: 'Password cannot be empty.' };
  }

  // 2. Check length (must be at least 8 characters)
  if (password.length < 8) {
    return { isValid: false, errorMessage: 'Password must be at least 8 characters long.' };
  }

  // 3. Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, errorMessage: 'Password must contain at least one uppercase letter.' };
  }

  // 4. Check for special character/symbol
  if (!/[!@#$%^&*(),.?":{}|<>\-_+=]/.test(password)) {
    return {
      isValid: false,
      errorMessage: 'Password must contain at least one special character.'
    };
  }

  // Success
  return { isValid: true, errorMessage: null };
};

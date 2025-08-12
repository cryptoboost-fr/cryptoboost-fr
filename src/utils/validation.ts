/**
 * Input validation and sanitization utilities
 * Prevents XSS, injection attacks, and validates user input
 */

// Email validation with comprehensive regex
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Password strength validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitize HTML to prevent XSS
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate and sanitize text input
export const sanitizeTextInput = (input: string, maxLength: number = 1000): string => {
  if (typeof input !== 'string') return '';
  
  return sanitizeHtml(input.trim()).slice(0, maxLength);
};

// Validate numeric input
export const validateNumber = (value: string | number, min?: number, max?: number): { isValid: boolean; value: number | null } => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num) || !isFinite(num)) {
    return { isValid: false, value: null };
  }
  
  if (min !== undefined && num < min) {
    return { isValid: false, value: null };
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, value: null };
  }
  
  return { isValid: true, value: num };
};

// Validate cryptocurrency amount
export const validateCryptoAmount = (amount: string | number): { isValid: boolean; value: number | null; error?: string } => {
  const result = validateNumber(amount, 0.00000001, 1000000);
  
  if (!result.isValid) {
    return {
      isValid: false,
      value: null,
      error: 'Montant invalide'
    };
  }
  
  // Check for reasonable decimal places (max 8 for crypto)
  const str = result.value!.toString();
  const decimalPlaces = str.includes('.') ? str.split('.')[1].length : 0;
  
  if (decimalPlaces > 8) {
    return {
      isValid: false,
      value: null,
      error: 'Maximum 8 décimales autorisées'
    };
  }
  
  return result;
};

// Validate UUID format
export const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Rate limiting for API calls
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    const now = Date.now();
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

// Export rate limiter instance
export const apiRateLimiter = new RateLimiter(100, 60000); // 100 requests per minute

// Form validation schemas
export const validationSchemas = {
  login: {
    email: (value: string) => validateEmail(value),
    password: (value: string) => value.length >= 6
  },
  
  register: {
    email: (value: string) => validateEmail(value),
    password: (value: string) => validatePassword(value).isValid,
    full_name: (value: string) => value.trim().length >= 2 && value.trim().length <= 100
  },
  
  transaction: {
    amount: (value: string | number) => validateCryptoAmount(value).isValid,
    crypto_type: (value: string) => /^[A-Z]{3,5}$/.test(value),
    description: (value: string) => value.length <= 500
  },
  
  investment: {
    amount: (value: string | number) => validateNumber(value, 1, 1000000).isValid,
    plan_id: (value: string) => validateUUID(value)
  }
};

// Comprehensive form validator
export const validateForm = <T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, (value: any) => boolean>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  const errors: Partial<Record<keyof T, string>> = {};
  
  for (const [field, validator] of Object.entries(schema)) {
    const value = data[field as keyof T];
    if (!validator(value)) {
      errors[field as keyof T] = `${field} est invalide`;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Security utilities
export const securityUtils = {
  sanitizeHtml,
  sanitizeTextInput,
  validateEmail,
  validatePassword,
  validateNumber,
  validateCryptoAmount,
  validateUUID,
  validateForm,
  apiRateLimiter
};

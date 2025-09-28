import { useState } from 'react';
import { z } from 'zod';

type ValidationResult<T> = {
  values: Partial<T>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (onSubmit: (values: T) => void) => (e: React.FormEvent) => void;
  reset: () => void;
  setValues: (values: Partial<T>) => void;
};

/**
 * A custom hook for form validation using Zod
 * @param schema The Zod schema to validate against
 * @param initialValues The initial values of the form
 * @returns An object containing form state and handlers
 */
export function useFormValidation<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  initialValues: Partial<T> = {}
): ValidationResult<T> {
  const [values, setValues] = useState<Partial<T>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: any) => {
    try {
      // Create a partial schema for just this field
      // We can't directly access schema.shape, so we'll validate the whole object
      // and just check for errors on this field
      schema.parse({ ...values, [name]: value } as T);
      setErrors((prev) => ({ ...prev, [name]: '' }));
      return '';
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((e) => e.path[0] === name);
        if (fieldError) {
          const errorMessage = fieldError.message || 'Invalid value';
          setErrors((prev) => ({ ...prev, [name]: errorMessage }));
          return errorMessage;
        }
      }
      return 'Validation error';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setValues((prev) => ({ ...prev, [name]: newValue }));
    if (touched[name]) {
      validateField(name, newValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateForm = (): boolean => {
    try {
      schema.parse(values as T);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const path = String(err.path[0]);
            newErrors[path] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (onSubmit: (values: T) => void) => (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    // Since we can't access schema.shape directly, we'll mark all fields in values as touched
    Object.keys(values).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    const isValid = validateForm();
    if (isValid) {
      onSubmit(values as T);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    isValid: Object.keys(errors).length === 0,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
  };
}
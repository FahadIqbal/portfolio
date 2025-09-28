import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '../formValidation';
import { contactFormSchema } from '../../types/validation';

describe('useFormValidation', () => {
  const initialValues = {
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
  };

  it('should initialize with provided values', () => {
    const { result } = renderHook(() =>
      useFormValidation(contactFormSchema, initialValues)
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isValid).toBe(true);
  });

  it('should update values on change', () => {
    const { result } = renderHook(() =>
      useFormValidation(contactFormSchema, initialValues)
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.name).toBe('John Doe');
  });

  it('should validate field on blur', () => {
    const { result } = renderHook(() =>
      useFormValidation(contactFormSchema, initialValues)
    );

    // Blur with empty email (invalid)
    act(() => {
      result.current.handleBlur({
        target: { name: 'email', value: '' },
      } as React.FocusEvent<HTMLInputElement>);
    });

    expect(result.current.errors.email).toBeTruthy();
    expect(result.current.touched.email).toBe(true);

    // Update with valid email
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'john@example.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Blur again to validate
    act(() => {
      result.current.handleBlur({
        target: { name: 'email', value: 'john@example.com' },
      } as React.FocusEvent<HTMLInputElement>);
    });

    expect(result.current.errors.email).toBeFalsy();
  });

  it('should validate all fields on submit', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useFormValidation(contactFormSchema, initialValues)
    );

    const preventDefault = vi.fn();

    // Try to submit with empty values
    act(() => {
      const submitHandler = result.current.handleSubmit(onSubmit);
      submitHandler({ preventDefault } as unknown as React.FormEvent);
    });

    // Should not call onSubmit with invalid data
    expect(preventDefault).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);

    // Fill in valid data
    act(() => {
      result.current.setValues({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message that is long enough',
        phone: '',
      });
    });

    // Submit with valid data
    act(() => {
      const submitHandler = result.current.handleSubmit(onSubmit);
      submitHandler({ preventDefault } as unknown as React.FormEvent);
    });

    // Should call onSubmit with valid data
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message that is long enough',
      phone: '',
    });
  });

  it('should reset form state', () => {
    const { result } = renderHook(() =>
      useFormValidation(contactFormSchema, initialValues)
    );

    // Change some values
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' },
      } as React.ChangeEvent<HTMLInputElement>);

      result.current.handleBlur({
        target: { name: 'email', value: '' },
      } as React.FocusEvent<HTMLInputElement>);
    });

    // Reset the form
    act(() => {
      result.current.reset();
    });

    // Should be back to initial state
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });
});
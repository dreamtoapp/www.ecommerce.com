// app/dashboard/drivers/helper/driverFormInputs.ts
import {
  FieldErrors,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { z } from 'zod';

export type DriverFormData = z.infer<typeof driverSchema>;



export const driverSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty('الاسم مطلوب'),

  email: z
    .string()
    .trim()
    .email('صيغة البريد الإلكتروني غير صحيحة'),

  phone: z
    .string()
    .trim()
    .nonempty('رقم الهاتف مطلوب')
    .regex(/^\d{10}$/, 'رقم الهاتف يجب أن يحتوي على 10 أرقام فقط'),

  address: z
    .string()
    .trim()
    .nonempty('العنوان مطلوب'),

  password: z
    .string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});


interface Field {
  name: keyof DriverFormData;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  maxLength?: number;
  error?: string;
}

export const getDriverFields = (
  register: UseFormRegister<DriverFormData>,
  errors: FieldErrors<DriverFormData>
): Field[] => [
    {
      name: 'name',
      type: 'text',
      placeholder: 'الاسم',
      register: register('name'),
      error: errors.name?.message as string,
    },
    {
      name: 'email',
      type: 'email',
      placeholder: 'البريد الإلكتروني',
      register: register('email'),
      error: errors.email?.message as string,
    },
    {
      name: 'phone',
      type: 'tel',
      placeholder: 'رقم الهاتف',
      register: register('phone'),
      maxLength: 10,
      error: errors.phone?.message as string,
    },
    {
      name: 'address',
      type: 'text',
      placeholder: 'العنوان',
      register: register('address'),
      error: errors.address?.message as string,
    },
    {
      name: 'password',
      type: 'text',
      placeholder: 'كلمة المرور',
      register: register('password'),
      error: errors.password?.message as string,
    },
  ];



// helpers/userZodAndInputs.ts
import {
  FieldErrors,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { z } from 'zod';

// Validation schema
export const UserSchema = z.object({
  name: z.string().trim().nonempty('الاسم مطلوب'),
  email: z.string().trim().email('صيغة البريد الإلكتروني غير صحيحة'),
  phone: z
    .string()
    .trim()
    .nonempty('رقم الهاتف مطلوب')
    .regex(/^\d{10}$/, 'رقم الهاتف يجب أن يحتوي على 10 أرقام فقط'),
  address: z.string().trim().nonempty('العنوان مطلوب'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  sharedLocationLink: z.string().url('رابط غير صالح').optional().or(z.literal('')),
  latitude: z
    .string()
    .trim()
    .regex(
      /^-?([0-8]?[0-9](\.\d+)?|90(\.0+)?)$/,
      'صيغة خط العرض غير صحيحة'
    )
    .optional()
    .or(z.literal('')),
  longitude: z
    .string()
    .trim()
    .regex(
      /^-?((1[0-7][0-9]|[0-9]?[0-9])(\.\d+)?|180(\.0+)?)$/,
      'صيغة خط الطول غير صحيحة'
    )
    .optional()
    .or(z.literal('')),
});


export type UserFormData = z.infer<typeof UserSchema>;

interface Field {
  name: keyof UserFormData;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  maxLength?: number;
  error?: string;
  className?: string;
  latitude?: string;
  longitude?: string;
  sharedLocationLink?: string;
}

interface FieldSection {
  section: string;
  hint?: boolean; // Assuming this is a typo in the original code, should be 'false'
  fields: Field[];
}

export const getDriverFields = (
  register: UseFormRegister<UserFormData>,
  errors: FieldErrors<UserFormData>
): FieldSection[] => [
    {
      section: 'البيانات الشخصية',
      hint: false,
      fields: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'الاسم',
          register: register('name'),
          error: errors.name?.message,
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'البريد الإلكتروني',
          register: register('email'),
          error: errors.email?.message,
        },
        {
          name: 'phone',
          type: 'tel',
          placeholder: 'رقم الهاتف',
          register: register('phone'),
          maxLength: 10,
          error: errors.phone?.message,
        },
        {
          name: 'password',
          type: 'text',
          placeholder: 'كلمة المرور',
          register: register('password'),
          error: errors.password?.message,
        },
        {
          name: 'address',
          type: 'text',
          placeholder: 'العنوان',
          register: register('address'),
          error: errors.address?.message,
          className: "col-span-2",
        },
      ],
    },
    {
      section: 'الموقع الجغرافي',
      hint: true,
      fields: [
        {
          name: 'sharedLocationLink',
          type: 'url',
          placeholder: 'رابط الموقع المشترك (اختياري)',
          register: register('sharedLocationLink'),
          error: errors.sharedLocationLink?.message,
          className: "col-span-2",
        },
        {
          name: 'latitude',
          type: 'text',
          placeholder: 'خط العرض',
          register: register('latitude'),
          error: errors.latitude?.message,
        },
        {
          name: 'longitude',
          type: 'text',
          placeholder: 'خط الطول',
          register: register('longitude'),
          error: errors.longitude?.message,
        },
      ],
    },
  ];

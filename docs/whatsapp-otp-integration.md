# WhatsApp Cloud API OTP Integration

## Overview

This document outlines the implementation of WhatsApp Cloud API for OTP (One-Time Password) delivery, following Meta's official best practices and guidelines.

## Features Implemented

### ✅ Core Functionality
- **Phone Number Validation**: International format validation and automatic country code detection
- **Rate Limiting**: Prevents abuse with configurable limits (5 requests per hour)
- **Cooldown System**: 2-minute cooldown between resend attempts
- **Bilingual Support**: Arabic (primary) and English message templates
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Database Integration**: Seamless integration with existing user management system

### ✅ Security Features
- **OTP Expiration**: 10-minute validity period
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Strict phone number format validation
- **Secure Storage**: OTP codes stored securely in database

## Environment Variables Required

```env
# WhatsApp Cloud API Configuration
WHATSAPP_PERMANENT_TOKEN=your_permanent_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Application Configuration
APP_NAME=Your App Name
```

## API Functions

### 1. `otpViaWhatsApp(phoneNumber: string)`

Sends OTP via WhatsApp to the specified phone number.

**Parameters:**
- `phoneNumber`: Phone number in any format (will be automatically formatted)

**Returns:**
```typescript
{
  success: boolean;
  message: string;
  token?: string;
  expires?: Date;
  phoneNumber?: string;
}
```

**Usage:**
```typescript
import { otpViaWhatsApp } from '@/app/(e-comm)/auth/verify/action/otp-via-whatsapp';

const result = await otpViaWhatsApp('+966501234567');
if (result.success) {
  console.log('OTP sent successfully');
} else {
  console.error(result.message);
}
```

### 2. `verifyTheUser(phoneNumber: string, code?: string)`

Verifies the OTP code and activates the user account.

**Parameters:**
- `phoneNumber`: Phone number used for OTP
- `code`: OTP code to verify (optional)

**Returns:**
```typescript
{
  success: boolean;
  message: string;
}
```

### 3. `resendOTP(phoneNumber: string)`

Resends OTP with cooldown protection.

**Parameters:**
- `phoneNumber`: Phone number to resend OTP to

**Returns:**
```typescript
{
  success: boolean;
  message: string;
  token?: string;
  expires?: Date;
  phoneNumber?: string;
}
```

## Message Templates

### Arabic Template (Primary)
```
🔐 رمز التحقق الخاص بك

رمز التحقق: *{OTP}*

⏰ هذا الرمز صالح لمدة 10 دقائق فقط

⚠️ لا تشارك هذا الرمز مع أي شخص

إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.

شكراً لك
{APP_NAME}
```

### English Template (Fallback)
```
🔐 Your Verification Code

Verification Code: *{OTP}*

⏰ This code is valid for 10 minutes only

⚠️ Do not share this code with anyone

If you didn't request this code, please ignore this message.

Thank you
{APP_NAME}
```

## Phone Number Handling

### Automatic Formatting
- **Input**: `0501234567` → **Output**: `+966501234567`
- **Input**: `966501234567` → **Output**: `+966501234567`
- **Input**: `+966501234567` → **Output**: `+966501234567`

### Validation Rules
- Must be in international format
- Supports all country codes
- Automatically adds Saudi Arabia (+966) if no country code provided
- Removes all non-digit characters except `+`

## Rate Limiting

### OTP Requests
- **Limit**: 5 requests per hour per phone number
- **Reset**: After 1 hour from first request
- **Storage**: In-memory Map (consider Redis for production)

### Resend Cooldown
- **Cooldown**: 2 minutes between resend attempts
- **Purpose**: Prevents spam and abuse

## Error Handling

### Common Error Messages

| Error | Message (Arabic) | Message (English) |
|-------|------------------|-------------------|
| Invalid phone number | رقم الهاتف غير صحيح | Invalid phone number |
| Rate limit exceeded | تم تجاوز الحد الأقصى لطلبات الرمز | Rate limit exceeded |
| WhatsApp API failure | فشل في إرسال رمز التحقق عبر WhatsApp | Failed to send OTP via WhatsApp |
| Invalid OTP | رمز التحقق غير صحيح | Invalid verification code |
| User not found | لم يتم العثور على المستخدم | User not found |

## Database Integration

### User Table Updates
The system automatically handles:
- Creating new users with phone numbers
- Updating existing users with new OTP codes
- Maintaining consistent phone number format
- Setting user verification status

### Database Schema Requirements
```sql
-- Ensure your user table has these fields:
phone: String
isOtp: Boolean
otpCode: String?
isActive: Boolean
```

## Best Practices Implemented

### ✅ Meta's WhatsApp Business API Guidelines

1. **Message Content**
   - Clear, concise messaging
   - Proper use of formatting (bold text with asterisks)
   - Security warnings included
   - Professional tone maintained

2. **Rate Limiting**
   - Respects WhatsApp's rate limits
   - Implements application-level rate limiting
   - Prevents abuse and spam

3. **Error Handling**
   - Comprehensive error catching
   - User-friendly error messages
   - Proper logging for debugging

4. **Phone Number Validation**
   - International format compliance
   - Automatic formatting and validation
   - Support for multiple input formats

### ✅ Security Best Practices

1. **OTP Security**
   - 10-minute expiration
   - One-time use codes
   - Secure storage in database

2. **Input Validation**
   - Strict phone number validation
   - SQL injection prevention
   - XSS protection

3. **Rate Limiting**
   - Prevents brute force attacks
   - Configurable limits
   - Cooldown periods

## Production Considerations

### 1. Rate Limiting Storage
For production, consider replacing the in-memory Map with:
- **Redis**: For distributed systems
- **Database**: For persistent storage
- **External service**: Like Upstash Redis

### 2. Monitoring
Implement monitoring for:
- WhatsApp API response times
- Success/failure rates
- Rate limit hits
- Error patterns

### 3. Logging
Add structured logging for:
- OTP requests and responses
- Rate limit violations
- API errors
- User verification events

### 4. Backup Strategy
Consider implementing:
- SMS fallback for WhatsApp failures
- Email fallback for critical operations
- Multiple WhatsApp phone numbers

## Testing

### Unit Tests
```typescript
// Test phone number validation
expect(validateAndFormatPhoneNumber('0501234567')).toBe('+966501234567');
expect(validateAndFormatPhoneNumber('+966501234567')).toBe('+966501234567');
expect(validateAndFormatPhoneNumber('invalid')).toBe(null);

// Test rate limiting
expect(checkRateLimit('+966501234567')).toBe(true);
expect(checkRateLimit('+966501234567')).toBe(true);
// ... after 5 attempts should return false
```

### Integration Tests
```typescript
// Test complete OTP flow
const result = await otpViaWhatsApp('+966501234567');
expect(result.success).toBe(true);
expect(result.phoneNumber).toBe('+966501234567');

const verifyResult = await verifyTheUser('+966501234567', result.token);
expect(verifyResult.success).toBe(true);
```

## Troubleshooting

### Common Issues

1. **WhatsApp API Errors**
   - Check `WHATSAPP_PERMANENT_TOKEN` validity
   - Verify `WHATSAPP_PHONE_NUMBER_ID` is correct
   - Ensure phone number is in international format

2. **Rate Limiting Issues**
   - Check if user is hitting rate limits
   - Verify cooldown periods are working
   - Monitor rate limit store size

3. **Database Issues**
   - Ensure user table has required fields
   - Check database connection
   - Verify phone number format consistency

### Debug Mode
Enable debug logging by setting:
```env
DEBUG_WHATSAPP=true
```

## Migration from Email OTP

### Steps to Migrate
1. Update environment variables
2. Replace email OTP calls with WhatsApp OTP calls
3. Update UI to collect phone numbers instead of emails
4. Test thoroughly in staging environment
5. Deploy with feature flag for gradual rollout

### Backward Compatibility
The system maintains backward compatibility by:
- Supporting both phone and email fields
- Graceful fallback handling
- Database schema compatibility

## Support

For issues or questions:
1. Check the error logs
2. Verify environment variables
3. Test with WhatsApp Business API documentation
4. Contact the development team

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Compatibility**: WhatsApp Business API v18.0+ 
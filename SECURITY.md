# Security Measures

This document outlines the security measures implemented in this Next.js application.

## Security Headers

The following security headers are configured in `next.config.ts`:

- **X-Frame-Options: DENY** - Prevents clickjacking attacks
- **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing
- **Referrer-Policy: strict-origin-when-cross-origin** - Controls referrer information
- **Permissions-Policy** - Restricts browser features
- **Content-Security-Policy** - Controls allowed resources

## Input Validation & Sanitization

### File Upload Security (`/app/complete-profile/page.tsx`)
- File type validation (only images allowed)
- File size limit (5MB max)
- Extension whitelist (jpg, jpeg, png, gif, webp)
- MIME type verification

### Profile Data (`/app/api/profile/route.ts`)
- Input sanitization to prevent XSS
- Length limits on all fields
- URL validation for avatar URLs
- Domain whitelist for avatar URLs

### Authentication (`/app/api/auth/signup/route.ts`)
- Email format validation
- Password strength requirements (min 8 characters)
- Rate limiting on auth endpoints

## Rate Limiting

Implemented in `/lib/rate-limit.ts`:

- **Auth endpoints**: 5 attempts per 15 minutes
- **API endpoints**: 30 requests per minute
- **Upload endpoints**: 10 uploads per hour

## CSRF Protection

CSRF tokens are implemented in `/lib/csrf.ts` for state-changing operations.

## Open Redirect Protection

The auth callback (`/app/auth/callback/route.ts`) validates redirect URLs to prevent open redirect attacks.

## XSS Prevention

- Removed dangerous `dangerouslySetInnerHTML` usage
- All user input is sanitized before storage
- React's built-in XSS protection is enabled
- Strict Content Security Policy

## Additional Security Measures

- **React Strict Mode**: Enabled for additional runtime checks
- **HTTPS Only**: Secure cookies in production
- **SameSite Cookies**: Protection against CSRF
- **HttpOnly Cookies**: Protection against XSS

## Dependencies

Regular dependency updates are recommended to patch known vulnerabilities:

```bash
npm audit
npm audit fix
```

## Reporting Security Issues

If you discover a security vulnerability, please email security@yourapp.com with details.

## Security Checklist

- [ ] Keep dependencies updated
- [ ] Review and test input validation regularly
- [ ] Monitor rate limiting effectiveness
- [ ] Audit security headers periodically
- [ ] Review authentication flows
- [ ] Test file upload restrictions
- [ ] Verify CSRF protection on all state-changing endpoints
# Security Policy

## Supported Versions

We currently support security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via GitHub Security Advisories:
https://github.com/bjpl/colombia_department_puzzle/security/advisories/new

You should receive a response within 48 hours. If for some reason you do not, please follow up to ensure we received your original message.

Please include the following information:
- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

## Security Measures Implemented

### Client-Side Security

1. **Content Security Policy (CSP)**
   - Strict CSP headers preventing XSS attacks
   - Inline scripts restricted to trusted sources
   - External resources limited to allowlisted domains

2. **Input Sanitization**
   - All user inputs validated and sanitized
   - No `eval()` or `dangerouslySetInnerHTML` usage
   - TypeScript strict mode for type safety

3. **Dependency Security**
   - Regular dependency audits via `npm audit`
   - Automated security updates via Dependabot
   - No known vulnerabilities in production dependencies

### Authentication & Data Security

1. **Supabase Authentication**
   - Secure token storage using encrypted localStorage
   - Automatic token refresh
   - Session validation on every request
   - Cross-tab session synchronization

2. **Environment Variables**
   - All secrets stored in environment variables
   - `.env` files excluded from version control
   - `.env.example` provided for reference only
   - No hardcoded credentials in source code

3. **API Security**
   - All API calls use HTTPS only
   - Row Level Security (RLS) enabled in Supabase
   - Rate limiting on API endpoints
   - CORS policies properly configured

### Infrastructure Security

1. **HTTP Security Headers**
   - `Strict-Transport-Security` (HSTS) with preload
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy` restricting sensitive features

2. **Vercel Deployment**
   - Automatic HTTPS/SSL
   - DDoS protection
   - Geographic edge caching
   - Secure build environment

3. **Progressive Web App (PWA)**
   - Service worker code signed and verified
   - Offline storage encrypted
   - Cache poisoning prevention
   - Secure update mechanism

### Monitoring & Incident Response

1. **Error Tracking**
   - Sentry integration for error monitoring
   - PII data excluded from error reports
   - Rate-limited error submissions

2. **Audit Logging**
   - User actions logged (with consent)
   - Security events tracked
   - Regular log reviews

## Security Best Practices for Contributors

1. **Code Review**
   - All PRs require security review
   - Automated security scanning on PRs
   - No secrets in commit history

2. **Dependency Management**
   - Review dependencies before adding
   - Keep dependencies up to date
   - Use exact versions in production

3. **Testing**
   - Security test cases required
   - E2E tests include security scenarios
   - Regular penetration testing

4. **Authentication Development**
   - Never log sensitive data
   - Use secure session management
   - Implement proper RBAC

## Known Limitations

1. **Client-Side Storage**
   - LocalStorage used for caching (non-sensitive data only)
   - Session tokens encrypted but stored in browser
   - Users should use trusted devices

2. **Third-Party Services**
   - Security depends on Supabase, Vercel infrastructure
   - Google Analytics privacy policy applies
   - Sentry data processing agreement applies

3. **Browser Security**
   - Relies on browser security features
   - Some browsers may not support all security headers
   - Users should keep browsers updated

## Security Update Process

1. **Vulnerability Assessment**
   - Severity classification (Critical, High, Medium, Low)
   - Impact analysis
   - Exploitability assessment

2. **Patch Development**
   - Develop fix in private fork
   - Test thoroughly
   - Prepare security advisory

3. **Disclosure**
   - Coordinate with reporters
   - Publish security advisory
   - Release patched version
   - Notify users via GitHub

4. **Post-Incident**
   - Root cause analysis
   - Improve detection
   - Update security policies

## Security Checklist for Releases

- [ ] `npm audit` passes with 0 vulnerabilities
- [ ] All dependencies up to date
- [ ] Security headers configured
- [ ] CSP policy validated
- [ ] Authentication flows tested
- [ ] E2E security tests pass
- [ ] No secrets in code or git history
- [ ] `.env.example` updated
- [ ] SECURITY.md reviewed
- [ ] Penetration test completed (major releases)

## Compliance & Standards

This project follows:
- OWASP Top 10 security practices
- WCAG 2.1 AAA accessibility standards
- GDPR data protection principles (when applicable)
- Secure coding practices for JavaScript/TypeScript

## Contact

For security concerns: https://github.com/bjpl/colombia_department_puzzle/security/advisories/new

For general inquiries: Open a GitHub issue (non-security related only)

## Acknowledgments

We appreciate the security research community and thank all researchers who responsibly disclose vulnerabilities to us.

---

Last updated: 2025-11-03

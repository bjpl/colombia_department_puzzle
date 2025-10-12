/**
 * Secure Storage Implementation
 *
 * Provides encrypted storage for sensitive data using Web Crypto API.
 * Implements AES-GCM encryption with device fingerprint-based key derivation.
 *
 * @module lib/secureStorage
 * @see docs/architecture/02-security-policies.md
 */

/**
 * Secure storage class using Web Crypto API for encryption
 *
 * Features:
 * - AES-GCM encryption
 * - PBKDF2 key derivation (100,000 iterations)
 * - Device fingerprint-based key generation
 * - Automatic IV generation
 */
export class SecureStorage {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  private static readonly PBKDF2_ITERATIONS = 100000;
  private static readonly SALT = 'colombia-puzzle-salt-v1';

  /**
   * Generate encryption key from device fingerprint
   *
   * @returns CryptoKey for AES-GCM encryption
   */
  private static async getEncryptionKey(): Promise<CryptoKey> {
    // Get device fingerprint
    const fingerprint = await this.getDeviceFingerprint();

    // Import fingerprint as key material
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(fingerprint),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    // Derive encryption key using PBKDF2
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(this.SALT),
        iterations: this.PBKDF2_ITERATIONS,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: this.ALGORITHM, length: this.KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Generate device fingerprint
   *
   * Creates a unique fingerprint based on device characteristics.
   * This is used as the basis for encryption key derivation.
   *
   * @returns SHA-256 hash of device characteristics
   */
  private static async getDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width.toString(),
      screen.height.toString(),
      new Date().getTimezoneOffset().toString(),
      navigator.hardwareConcurrency?.toString() || '0',
    ];

    const fingerprint = components.join('|');

    // Hash the fingerprint
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Encrypt and store data in localStorage
   *
   * @param key - Storage key
   * @param value - Data to encrypt and store
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      const encryptionKey = await this.getEncryptionKey();
      const encoder = new TextEncoder();
      const data = encoder.encode(value);

      // Generate random IV (Initialization Vector)
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Encrypt data
      const encrypted = await crypto.subtle.encrypt(
        { name: this.ALGORITHM, iv },
        encryptionKey,
        data
      );

      // Combine IV + encrypted data
      const encryptedArray = new Uint8Array(encrypted);
      const combined = new Uint8Array(iv.length + encryptedArray.length);
      combined.set(iv);
      combined.set(encryptedArray, iv.length);

      // Convert to base64 for storage
      const base64 = btoa(String.fromCharCode(...combined));
      localStorage.setItem(key, base64);
    } catch (error) {
      console.error('SecureStorage encryption error:', error);
      throw new Error('Failed to store data securely');
    }
  }

  /**
   * Retrieve and decrypt data from localStorage
   *
   * @param key - Storage key
   * @returns Decrypted data or null if not found/invalid
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const encryptionKey = await this.getEncryptionKey();

      // Decode from base64
      const combined = Uint8Array.from(atob(stored), c => c.charCodeAt(0));

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      // Decrypt data
      const decrypted = await crypto.subtle.decrypt(
        { name: this.ALGORITHM, iv },
        encryptionKey,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('SecureStorage decryption error:', error);
      return null;
    }
  }

  /**
   * Remove item from storage
   *
   * @param key - Storage key
   */
  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all app-specific storage
   *
   * Only removes keys prefixed with 'colombia-puzzle-'
   */
  static clear(): void {
    const keys = Object.keys(localStorage).filter(k =>
      k.startsWith('colombia-puzzle-')
    );
    keys.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Check if Web Crypto API is available
   *
   * @returns True if crypto API is available
   */
  static isAvailable(): boolean {
    return (
      typeof crypto !== 'undefined' &&
      typeof crypto.subtle !== 'undefined' &&
      typeof crypto.subtle.encrypt === 'function'
    );
  }
}

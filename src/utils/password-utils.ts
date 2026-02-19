/**
 * Password Hashing Utility - Browser-Compatible Version
 * 
 * Uses Web Crypto API (built into browsers) instead of bcryptjs
 * This ensures compatibility without external dependencies
 */

/**
 * Hash a password using PBKDF2 (built into Web Crypto API)
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // Convert password to bytes
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(password);
    
    // Generate a random salt
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Import the password as a key
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBytes,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    // Derive a key using PBKDF2
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000, // 100,000 iterations for security
        hash: 'SHA-256'
      },
      keyMaterial,
      256 // 256 bits
    );
    
    // Combine salt and hash
    const hashArray = new Uint8Array(derivedBits);
    const combined = new Uint8Array(salt.length + hashArray.length);
    combined.set(salt);
    combined.set(hashArray, salt.length);
    
    // Convert to base64 for storage
    const base64Hash = btoa(String.fromCharCode(...combined));
    
    return `pbkdf2$${base64Hash}`;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // Check if it's our format
    if (!hash.startsWith('pbkdf2$')) {
      console.error('Invalid hash format');
      return false;
    }
    
    // Extract the base64 part
    const base64Hash = hash.substring(7); // Remove 'pbkdf2$'
    
    // Decode from base64
    const combined = Uint8Array.from(atob(base64Hash), c => c.charCodeAt(0));
    
    // Extract salt and stored hash
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);
    
    // Hash the input password with the same salt
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(password);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBytes,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    
    const computedHash = new Uint8Array(derivedBits);
    
    // Compare hashes (constant-time comparison)
    if (computedHash.length !== storedHash.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < computedHash.length; i++) {
      result |= computedHash[i] ^ storedHash[i];
    }
    
    return result === 0;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * Check if a string is already a hashed password
 */
export function isHashedPassword(str: string): boolean {
  return str.startsWith('pbkdf2$');
}

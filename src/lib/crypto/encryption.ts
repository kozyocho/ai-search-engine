export class SecureStorage {
  private static encoder = new TextEncoder();
  private static decoder = new TextDecoder();

  static async generateKey(password: string): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      this.encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: this.encoder.encode("ai-search-engine-salt"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  static async encrypt(text: string, password: string): Promise<string> {
    const key = await this.generateKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      this.encoder.encode(text)
    );

    const encryptedArray = new Uint8Array(
      iv.length + encryptedContent.byteLength
    );
    encryptedArray.set(iv);
    encryptedArray.set(new Uint8Array(encryptedContent), iv.length);

    return btoa(String.fromCharCode(...encryptedArray));
  }

  static async decrypt(
    encryptedText: string,
    password: string
  ): Promise<string | null> {
    try {
      const key = await this.generateKey(password);
      const encryptedArray = Uint8Array.from(atob(encryptedText), (c) =>
        c.charCodeAt(0)
      );
      const iv = encryptedArray.slice(0, 12);
      const data = encryptedArray.slice(12);

      const decryptedContent = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        data
      );

      return this.decoder.decode(decryptedContent);
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  }
}

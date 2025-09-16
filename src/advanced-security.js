// src/advanced-security.js
const crypto = require("crypto");
const readline = require("readline-sync");
require("dotenv").config(); // NEW: Load environment variables

// --- 1. Professional Key Management (from Environment Variables) ---
// NEW: Load the master key from environment variables instead of a file.
// This is a standard practice to keep secrets out of the codebase.
const keyHex = process.env.ENCRYPTION_KEY;
if (!keyHex || keyHex.length !== 64) {
  console.error("FATAL: ENCRYPTION_KEY not found or invalid in .env file. It must be a 64-character hex string.");
  // In a real app, you'd generate one: crypto.randomBytes(32).toString('hex')
  process.exit(1);
}
const key = Buffer.from(keyHex, "hex");
const ALGORITHM = "aes-256-gcm"; // NEW: Using GCM for authenticated encryption
const IV_LENGTH = 16; // GCM standard IV length
const AUTH_TAG_LENGTH = 16; // GCM standard auth tag length

// --- 2. Fortified Encryption / Decryption (Using AES-GCM) ---
// NEW: This is a major upgrade. GCM provides both confidentiality (encryption)
// and authenticity (protection against tampering).
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH); // ALWAYS use a new IV for each encryption
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // NEW: Prepend the IV and append the Auth Tag to the encrypted data.
  // This is the standard way to store them.
  return Buffer.concat([iv, authTag, encrypted]).toString("hex");
}

function decrypt(hex) {
  const data = Buffer.from(hex, "hex");
  const iv = data.slice(0, IV_LENGTH);
  const authTag = data.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = data.slice(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag); // IMPORTANT: Verify the auth tag

  try {
    const decrypted = decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
    return decrypted;
  } catch (err) {
    // NEW: If the auth tag is invalid or data was tampered with, it will throw an error.
    console.error("Decryption failed: Data may have been tampered with.");
    return null;
  }
}

// --- 3. Advanced Input Validation ---
// NEW: Replaced the simple blocklist. This function looks for suspicious
// characters that are often used in injection attacks.
function validateInput(input) {
  const suspiciousChars = /['";`\-\-]/;
  if (suspiciousChars.test(input)) {
    return { isSafe: false, reason: "Suspicious characters detected" };
  }
  // The REAL protection is using an ORM like Prisma which uses parameterized queries.
  // This function is just a first line of defense.
  return { isSafe: true, reason: "Input appears safe" };
}

// --- Consent Check (No changes needed) ---
function checkConsent() {
  const consent = readline.question("🧠 Do you agree to data being processed securely? (YES/NO): ");
  if (consent.toUpperCase() !== "YES") {
    console.log("❌ Consent not given. Exiting.");
    process.exit(0);
  }
  console.log("✅ Consent given. Proceeding...");
  return true;
}

// --- Export Functions ---
module.exports = {
  encrypt,
  decrypt,
  validateInput,
  checkConsent
};

// --- Optional CLI Demo ---
if (require.main === module) {
  console.log("✨ Advanced Security Module Demo ✨");
  checkConsent();

  const username = readline.question("Enter your username: ");
  const validation = validateInput(username);
  if (!validation.isSafe) {
    console.log(`🚨 Input rejected! Reason: ${validation.reason}.`);
    process.exit(1);
  }

  const message = readline.question("Enter your secret counselling note: ");
  const encrypted = encrypt(message);
  const decrypted = decrypt(encrypted);

  console.log("\n✅ Safe Input Accepted");
  console.log("👤 User:", username);
  console.log("🔒 Encrypted Note (AES-GCM):", encrypted);
  
  if (decrypted) {
    console.log("🔓 Decrypted Note:", decrypted);
  }

  console.log("\n✨ Data protected with Authenticated Encryption (AES-GCM) + Advanced Validation + Consent Layer");
}

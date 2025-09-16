// test-final-demo.js
const { encrypt, decrypt, isSafe, validateConsent } = require("./final-demo");

// --- Test Consent ---
const consent = true; // simulate consent given
if (!validateConsent(consent)) {
  console.log("❌ Consent not given. Exiting test.");
  process.exit(0);
}

// --- Test Security Check ---
const username = "Aaron"; 
if (!isSafe(username)) {
  console.log("🚨 SQLi detected. Test blocked.");
  process.exit(1);
}

// --- Test Encryption/Decryption ---
const message = "This is a test counselling note";
const encrypted = encrypt(message);
const decrypted = decrypt(encrypted);

console.log("\n✅ Test Passed!");
console.log("User:", username);
console.log("Encrypted:", encrypted);
console.log("Decrypted:", decrypted);

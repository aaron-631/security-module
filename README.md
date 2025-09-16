# SIH 2025 - Advanced Security Module
![Security](https://img.shields.io/badge/Security-AES--256--GCM%20%26%20Input%20Validation-blueviolet)

## 📖 Overview
This module is the **core security layer** for our Digital Mental Health application. It provides **production-grade authenticated encryption** and a first line of defense against common injection attacks. Lightweight, self-contained, and easily integrable into backend services.

**Author:** Aaron Chakraborty (`aaron-631`)

---

## ✨ Core Features
- **Authenticated Encryption:** AES-256-GCM encrypts data while ensuring integrity.  
- **Secret Management:** Loads master encryption key from environment variables (`.env`) for secure secret handling.  
- **Robust Input Validation:** Detects suspicious characters, replacing fragile blocklists.  
- **Modular & Self-Contained:** Exported as a Node.js module with minimal dependencies for easy integration.

---

## 🚀 Getting Started

Follow these steps to run the security module locally.

### 1️⃣ Clone & Update Code
```bash
git pull origin main
````

### 2️⃣ Install Dependencies

```bash
npm install
```

*(Includes `dotenv` for environment variable support.)*

### 3️⃣ Configure `.env`

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Add the master `ENCRYPTION_KEY` provided by me:

```env
ENCRYPTION_KEY=YOUR_SECRET_KEY
```

### 4️⃣ Verify Setup

Run the built-in demo:

```bash
node src/advanced-security.js
```

If no errors occur, the module is ready for integration.

---

## 💻 API Usage

Import the module in Node.js:

```javascript
const security = require('./src/advanced-security.js');
```

### `security.encrypt(text)`

Encrypt a string with AES-256-GCM.

* **Input:** `text` (String)
* **Output:** Encrypted hex string

**Example:**

```javascript
const encrypted = security.encrypt("Sensitive Note");
```

### `security.decrypt(encryptedText)`

Decrypt a string previously encrypted by this module.

* **Input:** `encryptedText` (String)
* **Output:** Original string or `null` if tampered

**Example:**

```javascript
const original = security.decrypt(encrypted);
```

### `security.validateInput(input)`

Checks user input for suspicious characters.

* **Input:** `input` (String)
* **Output:** `{ isSafe: Boolean, reason: String }`

**Example:**

```javascript
const result = security.validateInput("admin'; DROP TABLE users;");
if (!result.isSafe) console.error(result.reason);
```

---

## 🔒 Security Guidelines

* Always **check consent** before processing data.
* Encrypt all sensitive fields before saving to DB.
* Reject unsafe user input using `validateInput()`.
* Keep secrets only in `.env`, never in source code.

---

## 📌 CLI Demo Examples

### ✅ Safe Input

```
✨ Advanced Security Module Demo ✨
🧠 Consent given
Enter your username: Aaron
Enter secret note: Test note
✅ Safe Input Accepted
🔒 Encrypted Note: 280ffa72164dbc99...
🔓 Decrypted Note: Test note
```

### 🚨 Malicious Input

```
Enter your username: Hello; ""
🚨 Input rejected! Reason: Suspicious characters detected.
```

---

## 📂 Project Structure

```
security-module/
├── data/                      # Auto-generated secrets storage (optional)
├── src/
│   └── advanced-security.js   # Core security logic
├── .env.example               # Template for environment variables
├── package.json
└── README.md
```

---

## ✅ Quick Integration Recap

1. Install dependencies
2. Configure `.env` with `ENCRYPTION_KEY`
3. Import module in API routes
4. Use `encrypt()`, `decrypt()`, `validateInput()`, and `checkConsent()`
5. Remove or ignore CLI demo in production

> Module is now fully ready for secure backend integration!

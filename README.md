# 📌 Snapchat Automation with Playwright  

This project automates **Snapchat Web** using [Playwright](https://playwright.dev/).  
It logs into a Snapchat account once, saves the session state, and then automatically sends a predefined message to all friends.  

---

## 🚀 Features
- ✅ Login only once → session is saved in `storageState.json`.  
- ✅ On the first run, script pauses for manual login → after that session will be saved.  
- ✅ Sends a **single predefined message** to all friends.  
- ✅ Skips alphabet headers (A, B, C…) when iterating over the friends list.  
- ✅ Retries & reloads if an error occurs.  

---

## 📂 Project Structure
```
snap-automation/
├── constants/
│   └── messages.ts       # Predefined message
├── pages/
│   └── LoginPage.ts      # Page Object for login & chat actions
├── tests/
│   └── sendMessages.spec.ts  # Example test using LoginPage
├── storageState.json      # Saved session after first login
├── package.json
└── README.md
```

---

## ⚙️ Setup  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/nandubangari/snap-web-autmation-playwright.git
cd snap-web-autmation-playwright-main
```

### 2️⃣ Install dependencies  
```bash
npm install
```

### 3️⃣ Install Playwright browsers (only once)  
```bash
npx playwright install
```

---

## ▶️ Usage  

### First Run (login required)  
```bash
npx playwright test
```
- The browser will pause at the login page.  
- Manually log in to Snapchat.  
- Once logged in, the session is saved to `storageState.json`.  

### Subsequent Runs (auto-login)  
```bash
npx playwright test
```
- Uses the saved session from `storageState.json`.  
- No manual login required.  

---

## 📝 Message  
All messages are defined in **`constants/messages.ts`**.  

```ts
export const Messages = {
  Message: "Don't forget to check out my new project 🚀",
};
```

This message will be sent to all friends automatically.  

---

## 📌 Notes  
- Do not delete `storageState.json` unless you want to re-login.  
- Sending the same message to too many people may trigger Snapchat spam protection 🚨.  
- Remove `await this.page.pause();` in production after the first login is saved.  

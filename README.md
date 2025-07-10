# Buy-Sell @ IIITH

##  Tech Stack
- **Frontend:** React.js (Tailwind CSS for styling)
- **Backend:** Express.js
- **Database:** MongoDB
- **Server Runtime:** Node.js
- **Authentication:** JWT (jsonwebtoken) & bcrypt.js for password hashing

---

##  Features
### **Authentication & User Management**
- User Registration (**Only IIIT email allowed**)
- Secure login with JWT authentication
- Users remain logged in unless they log out
- Password hashing using **bcrypt.js**
- Google reCAPTCHA/LibreCaptcha support
- Page Redirections using cookies

### **Profile Page**
- User can edit his basic details like Name,Age
- Change Password Option
- User Reviews from Previous Buyers are also displayed

###  **Item Management**
- Users can add items to sell in the website under different **categories**
- Buyers can search and filter items
- Each Item with unique page and Item details page has seller information
- Add-to-cart option to add item to user Cart
- An item can be added to cart only once (if we revist same itempage again remove from cart will be showed)
- User can't add his own items to cart


###  **Orders & Transactions**
- Users can track **bought and sold items**
- Users can also see **pending and cancelled orders**
- Regenerate OTP option for pending orders
- Sellers see a **"Deliver Items"** page with **OTP-based order confirmation**
- Seller can also reject any order

###  **Reviews & Ratings**
- Buyers can leave reviews for sellers once a order is confirmed by Seller.
- Star-based rating system
- Buyer can Add a Comment on the product quality and service.

###  **Shopping Cart**
- Items can be added or removed from the cart
- Displays total cost
- **Final Order button** for checkout
- Displays OTP after placing succesful order.
- Successful orders reflect in the **Deliver Items** and **Orders History** pages

###  **Chatbot Support**
- AI chatbot (Gemini) for answering user queries
- Chat UI with **session-based** responses

---

## Quick Installation Guide
###  **Download the Zip**
```sh
   Download the Zip file and Extract it.
```

### **Front-End**
```sh
    cd Frontend (Navigate to Frontend Folder)

    npm install

    npm run dev
```

### **Back-End**
```sh
    cd Backend (Navigate to Backend Folder)

    npm install

    npm start
```

## Complete Installation Guide
###  **Download the Zip**
```sh
   Download the Zip file and Extract it.
```

### **Front-End Setup**

```sh 
   npx create-vite@latest

   npm install axios buffer react react-dom react-google-recaptcha react-markdown react-router-dom

   npx tailwindcss init -p

   configure tailwind.config.js

   /** @type {import('tailwindcss').Config} */
    export default {
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
        theme: {
            extend: {},
        },
        plugins: [],
    }

    npm run dev

```

### **Back-End Setup**

```sh
   npm init -y

   npm install @google/generative-ai axios bcrypt bcryptjs bottleneck cookie-parser cors 

   npm dotenv express jsonwebtoken mongoose mongoose-aggregate-paginate-v2 nodemon

   npm run start

```   

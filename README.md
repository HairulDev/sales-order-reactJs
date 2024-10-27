# Getting Started

Follow the instructions below to set up and run the project on your local machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20.11.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Setup Instructions

1. **Environment Variables**: Create an environment file `.env` in the root directory of your project and add the following values:

   ```plaintext
   VITE_APP_LIMIT=5
   VITE_APP_API_URL=https://localhost:7200
     ```
     
2. **Start Project**

   - Install project dependencies
    ```bash
    npm install
    ```
    - Start the project
    ```bash
    npm run dev
    ```
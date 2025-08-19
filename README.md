# Event-Driven-Fraud-Detection-Logger-Service

## Project Setup

1. Initialize the project
   ```bash
   npm init -y
   ```

2. Install dependencies
   ```bash
   npm install express
   ```

3. Install development dependencies
   ```bash
   npm install --save-dev dotenv nodemon
   ```

4. Update **package.json**
   - Change the project type to **module**
     ```json
     "type": "module"
     ```
   - Add the dev script
     ```json
     "scripts": {
       "dev": "nodemon index.js"
     }
     ```

5. This setup allows you to use **ES6 syntax** in the project.

## How to Run

```bash
npm run dev
```

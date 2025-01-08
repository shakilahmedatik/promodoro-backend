# Use Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the src folder and other necessary files
COPY src ./src

# Copy any other files in the root directory (if needed, e.g., .env.example)
COPY . .

# Set the working directory to src inside the container
WORKDIR /usr/src/app/src

# Expose the port your app runs on
EXPOSE 3000

# Run the app
CMD ["node", "index.js"]
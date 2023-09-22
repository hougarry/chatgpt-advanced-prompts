# Use a base image suitable for your project (e.g., node, python, etc.)
FROM node:18.17.1

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your application listens on (if applicable)
EXPOSE 3000

# Define the command to start your application
CMD ["npm", "start"]

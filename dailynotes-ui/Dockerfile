# Use the official Node.js image as a base
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json /app/

# Update npm to the latest version (optional but recommended for compatibility)
RUN npm install --legacy-peer-deps || cat /root/.npm/_logs/*debug*.log


# Copy the project files
COPY . /app/

# Build the React app for production
RUN npm run build

# Expose port
EXPOSE 3000

# Serve the React app
CMD ["npm", "run", "start"]

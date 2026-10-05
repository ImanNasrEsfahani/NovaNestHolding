# Use the latest Node.js LTS Alpine image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files
RUN apk add --no-cache openssl
COPY package*.json ./
COPY prisma ./prisma

# install node_modules
RUN npm install

# Copy source code
COPY . .

# Build the application - THIS IS CRUCIAL
RUN npm run build

# Expose port 3000 for the Next.js app
EXPOSE 3000 

# Start the application
CMD ["npm", "start"]
# CMD ["npm", "run", "dev:host"]
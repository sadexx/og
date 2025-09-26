#############################
# BUILD FOR LOCAL DEVELOPMENT
#############################
# Use Node.js LTS version
FROM node:22.16.0-alpine3.21 AS development

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for installing dependencies
COPY tsconfig*.json ./
COPY package*.json ./

# Install dependencies
RUN npm ci

# Set NODE_ENV environment variable
ENV NODE_ENV development

# Copy the rest of the code
COPY src/ src/
COPY public/ /usr/src/app/public
COPY global-bundle.pem /usr/src/app/
COPY src/modules/deep-link/.well-known/apple-app-site-association build/modules/deep-link/.well-known/
COPY src/modules/app-store-product/common/certificates/AppleRootCA-G3.cer build/modules/app-store-product/common/certificates/

# Build the app
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:watch"]

######################
# BUILD FOR PRODUCTION
######################
# Use Node.js LTS version
FROM node:22.16.0-alpine3.21 AS production

# Install Tini
RUN apk add --no-cache tini

# Set the working directory
WORKDIR /usr/src/app

# Create necessary directories
RUN mkdir -p /usr/src/app/logs /usr/src/app/build /usr/src/app/node_modules

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./
COPY tsconfig*.json ./

# Set proper ownership for the files and directories
RUN chown -R node:node /usr/src/app

# Switch to the node user
USER node

# Install ALL dependencies first (including devDependencies for types)
RUN npm ci --include=dev

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Copy the rest of the code
COPY --chown=node:node src/ src/
COPY --chown=node:node public/ public/
COPY --chown=node:node global-bundle.pem /usr/src/app/
COPY --chown=node:node src/modules/deep-link/.well-known/apple-app-site-association build/modules/deep-link/.well-known/
COPY --chown=node:node src/modules/app-store-product/common/certificates/AppleRootCA-G3.cer build/modules/app-store-product/common/certificates/

# Compile TypeScript
RUN npm run build

# Remove devDependencies
RUN npm prune --omit=dev

# Expose application port
EXPOSE 3000

# Use Tini to handle PID 1 and start the application
ENTRYPOINT ["/sbin/tini", "--"]

# Start application
CMD ["node", "build/main.js"]

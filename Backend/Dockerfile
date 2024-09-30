<<<<<<< HEAD

FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

COPY . .

EXPOSE 5000

# Define the entry point for the container
CMD ["node", "index.js"]
=======

FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

COPY . .

EXPOSE 5000

# Define the entry point for the container
CMD ["node", "index.js"]
>>>>>>> e06c4dcb4f355e8bd8d6a4fd5eee356cb6bc7c42

# Use an official Node.js runtime as a parent image
FROM node:21

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json ./

# Install project dependencies
RUN yarn install

# Copy the entire project directory to the working directory in the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD [ "yarn", "start"]


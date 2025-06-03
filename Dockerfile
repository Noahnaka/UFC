FROM node:18-alpine

WORKDIR /usr/src/app

# Install nodemon globally
RUN npm install -g nodemon

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Set proper permissions
RUN chown -R node:node /usr/src/app

# Switch to non-root user
USER node

EXPOSE 3000

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
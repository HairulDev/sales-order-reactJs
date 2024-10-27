# Stage 1: Build the dependencies
FROM node:14-alpine3.13 AS builder
WORKDIR /app
COPY package.json .
RUN npm install --ignore-scripts
COPY . .
RUN npm run build
# Add build timestamp
RUN node update-build.js

# Stage 2: Create the production image
FROM node:14-alpine3.13

WORKDIR /app
COPY --from=builder /app .
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
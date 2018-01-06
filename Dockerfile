### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:8-alpine as builder

COPY package.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force
RUN npm install -g typescript

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /api-app && cp -R ./node_modules ./api-app

WORKDIR /api-app

COPY . .

EXPOSE 3000
## Build the angular app in production mode and store the artifacts in dist folder
CMD ["npm", "start"]

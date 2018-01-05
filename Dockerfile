### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:8-alpine as builder
RUN npm install -g typescript

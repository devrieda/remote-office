FROM node:alpine
WORKDIR /work
COPY package.json package-lock.json ./
RUN npm i
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

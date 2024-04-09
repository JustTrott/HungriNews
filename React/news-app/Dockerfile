FROM node:20.12.1

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app

RUN npm run build

# Serve the build using serve package
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
FROM node:16-alpine

# RUN apk add --no-cache python2 g++ make
RUN apk add --no-cache git
WORKDIR /app
COPY . .

RUN yarn global add truffle && yarn

ENTRYPOINT [ "yarn", "test" ]

FROM node:12 as dev
WORKDIR /app

ENV NODE_ENV development
ENV SERVER_PORT 9999

CMD bash -c "npm i && npm run dev"

###########################
###########################

FROM dev as build

COPY package* ./
RUN npm i
RUN npm i material-ui@next

COPY public public
COPY server server
COPY src src

RUN npm test
RUN npm run build

###########################
###########################

FROM node:12 as prod
WORKDIR /app

ENV NODE_ENV production
ENV SERVER_PORT 80

COPY package* ./
RUN npm i

COPY --from=build /app/build build
COPY server server

CMD npm start

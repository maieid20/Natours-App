FROM node:18 as base

FROM base as development

WORKDIR /app

COPY  package.json .

RUN npm install

COPY  . .

ENV PORT=3000

EXPOSE  $PORT

CMD [ "npm" , "start"  ]


FROM base as  production

WORKDIR /app

COPY  package.json .

RUN npm install --only= production

COPY  . .

ENV PORT = 3000

EXPOSE  $PORT

CMD [ "npm" , "start:prod" ]

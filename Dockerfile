FROM node:12.5.0-alpine

ENV SERVICE_USER=app
ENV APP_DIR=/home/$SERVICE_USER/wex-qdoc-ui

RUN adduser -D -g '' $SERVICE_USER
ADD --chown=app:app . $APP_DIR

WORKDIR $APP_DIR
USER $SERVICE_USER

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

FROM node:9.8
COPY . /backend/
WORKDIR /backend/
RUN npm install --no-optional
RUN npm rebuild
RUN npm run build
CMD npm run production

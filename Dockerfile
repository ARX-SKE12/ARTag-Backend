FROM node:9.8
COPY . /backend/
WORKDIR /backend/
RUN npm i --no-optional
RUN npm rebuild
RUN rm -rf build
RUN npm run build
CMD npm run production

# Use the official image as a parent image.
FROM vuejs/ci

RUN mkdir /server

RUN npm install -g serve

CMD ["serve", "-s", "/server"]

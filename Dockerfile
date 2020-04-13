# Use the official image as a parent image.
FROM vuejs/ci
# Copy static file
COPY . /server

WORKDIR /server

CMD ["yarn", "install"]

CMD ["yarn", "prod"]

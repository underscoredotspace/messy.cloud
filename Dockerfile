FROM node:18-alpine AS build

RUN mkdir -p /opt/build;
WORKDIR /opt/build

COPY ./app ./app
COPY ./index.html .
COPY [ "package*.json", "tsconfig.json", "./" ]

RUN npm ci && npm run build


FROM node:18-alpine AS deps

RUN mkdir -p /opt/build;
WORKDIR /opt/build

COPY --from=build [ "/opt/build/package*.json", "./" ]
RUN npm ci --omit=dev --ignore-scripts


FROM lipanski/docker-static-website:latest AS release

COPY --from=deps /opt/build/node_modules /opt/app/node_modules
COPY --from=build /opt/build/dist /opt/app

WORKDIR /opt/app

CMD ["/busybox-httpd", "-f"]
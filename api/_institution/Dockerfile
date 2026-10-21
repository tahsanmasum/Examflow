# ExamFlow institution server. No npm packages are installed: it only needs Node.js 22.
FROM node:22-bookworm-slim
WORKDIR /app
# The whole unpacked package (including manifest.json and manifest.sig) goes into the image,
# so the server can verify its own files on every start.
COPY . /app
ENV NODE_ENV=production \
    PACKAGE_DIR=/app \
    DATA_DIR=/data \
    PORT=8080 \
    NODE_OPTIONS=--disable-warning=ExperimentalWarning
RUN mkdir -p /data && chown -R node:node /data
USER node
VOLUME ["/data"]
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD ["node", "server/src/healthcheck.js"]
CMD ["node", "server/src/server.js"]

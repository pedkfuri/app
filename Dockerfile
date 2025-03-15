FROM node:22
WORKDIR /app
COPY './dist/tcc.bundle.js' .
ENV PORT=${PORT} \
    NODE_ENV=${NODE_ENV} \
    GITLAB_TOKEN=${GITLAB_TOKEN} \
    GITLAB_HOST=${GITLAB_HOST} \
    HOSTNAME=${HOSTNAME} \
    OLLAMA_API=${OLLAMA_API} \
    OLLAMA_MODEL=${OLLAMA_MODEL} \
    GITHUB_TOKEN=${GITHUB_TOKEN} \
    GITHUB_REPO=${GITHUB_REPO} \
    WEBHOOK_URL=${WEBHOOK_URL} \
    WEBHOOK_USERNAME=${WEBHOOK_USERNAME} \
    SERVICE=${SERVICE} \
    GITLAB_PROJECT_ID=${GITLAB_PROJECT_ID} \
    OLLAMA_PROMPT_LANGUAGE=${OLLAMA_PROMPT_LANGUAGE} \
    GITHUB_OWNER=${GITHUB_OWNER}
EXPOSE $PORT
CMD ["node", "tcc.bundle.js"]
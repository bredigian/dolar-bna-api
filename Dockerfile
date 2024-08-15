FROM node:22

WORKDIR /app

COPY package*.json  /app/

RUN npm install -g pnpm && pnpm install && pnpm exec playwright install chromium --with-deps

COPY . .

EXPOSE 4040

RUN pnpm run build

CMD ["pnpm", "run", "start"]
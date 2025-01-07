FROM node:latest as build

# 设置工作目录为容器内的 /usr/src/app，后续的命令都将在这个目录下执行
WORKDIR /usr/src/app

RUN npm install -g pnpm

# 复制 package.json 和 package-lock.json 到容器
COPY package*.json ./
RUN pnpm install

# 复制项目文件并构建
COPY . .
RUN pnpm build:prod


FROM nginx:alpine

# 从名为 build 的阶段中，将目录 /app/dist 的内容（即构建输出的静态文件）复制到 Nginx 静态文件目录 /usr/share/nginx/html 中。
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

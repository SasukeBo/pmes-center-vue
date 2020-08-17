#!/bin/bash

# 判断serve命令并安装
if ! [ -x "$(command -v serve)" ]; then
  echo 'serve is not installed.' >&2
  npm install -g serve
fi

# 进入项目挂载目录
cd /project

# 创建dist文件夹
if [ ! -d "/dist" ]; then
  mkdir /dist
fi

# 复制生成文件
cp -rf /project/dist/* /dist

# 启动服务
serve -s /dist

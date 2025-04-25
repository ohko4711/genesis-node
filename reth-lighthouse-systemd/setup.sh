#!/bin/bash

set -e


# cp -r ../el-cl-genesis-data /opt/

RETH_URL="https://github.com/paradigmxyz/reth/releases/download/v1.3.12/reth-v1.3.12-x86_64-unknown-linux-gnu.tar.gz"
LIGHTHOUSE_URL="https://github.com/sigp/lighthouse/releases/download/v7.0.0/lighthouse-v7.0.0-x86_64-unknown-linux-gnu.tar.gz"

echo "🔧 获取公网 IP..."
IP=$(curl -s -4 https://icanhazip.com/)
if [ -z "$IP" ]; then
    echo "❌ 无法获取公网 IP"
    exit 1
fi
echo "✅ 公网 IP: $IP"

# echo "📦 下载并安装 reth..."
# curl -L "$RETH_URL" -o reth.tar.gz
# tar -xzf reth.tar.gz
# sudo install -m 755 reth /usr/local/bin/reth
# rm -rf reth

# echo "📦 下载并安装 lighthouse..."
# curl -L "$LIGHTHOUSE_URL" -o lighthouse.tar.gz
# tar -xzf lighthouse.tar.gz
# sudo install -m 755 lighthouse /usr/local/bin/lighthouse
# rm -rf lighthouse

echo "📁 创建 /etc/default 环境配置..."
sudo install -Dm644 defaults/reth /etc/default/reth
sudo install -Dm644 defaults/lighthouse /etc/default/lighthouse

# 替换 IP 地址
sudo sed -i "s|__IP_ADDRESS__|$IP|g" /etc/default/reth
sudo sed -i "s|__IP_ADDRESS__|$IP|g" /etc/default/lighthouse

echo "📄 安装 systemd 服务..."
sudo install -Dm644 reth.service /etc/systemd/system/reth.service
sudo install -Dm644 lighthouse.service /etc/systemd/system/lighthouse.service

echo "🔄 重新加载 systemd..."
sudo systemctl daemon-reexec
sudo systemctl daemon-reload

echo "🚀 启动服务..."
sudo systemctl enable --now reth.service
sudo systemctl enable --now lighthouse.service

echo "✅ 部署完成！"

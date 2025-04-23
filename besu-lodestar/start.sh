
export IP_ADDRESS=$(curl -4 https://icanhazip.com/)

#  docker compose logs 2>&1 | grep 'enode'
export EL_BOOTNODES=enode://7e0abd7c55784b526a755340636cfe21fb5c7dbae991619a4333f35d21e76d4da255f87350936e5d7fdb85fb391ba5152cb5b32b3c587985310ab83e90baf906@135.181.2.253:30303
#  curl localhost:4000/eth/v1/node/identity | jq
export CL_BOOTNODES=enr:-Mq4QGI25NQ_1lf0ec-O4MVecwisgDZQ4oyzANFXF4Pi9ILzTKEX2FhAI7XOGOAByakCdLTLDhJCr3b5kVfc3FeL_52GAZZi8BoMh2F0dG5ldHOIAAAABgAAAACEZXRoMpDutfrwUAAAAQoAAAAAAAAAgmlkgnY0gmlwhIe1Av2EcXVpY4IyyIlzZWNwMjU2azGhA_EMzYF3xGovUhuHBK1h-wtfeKmZtYqCE2Ut9nX52x2uiHN5bmNuZXRzD4N0Y3CCMsiDdWRwgi7g
export CL_STATICPEERS=/ip4/135.181.2.253/tcp/13000/p2p/16Uiu2HAmUswvp6uS5NV1S3EE4sYfqLazmsiKR5oRtGRysfFssMfK

if [ -z "$IP_ADDRESS" ]; then
    echo "Failed to retrieve IP address"
    exit 1
fi

echo "Using IP address: $IP_ADDRESS"

docker compose -f docker-compose.yml up -d
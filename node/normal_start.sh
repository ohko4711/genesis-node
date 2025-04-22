
export IP_ADDRESS=$(curl -4 https://icanhazip.com/)

#  docker compose logs 2>&1 | grep 'enode'
export EL_BOOTNODES=enode://3f73aa5f01807cc8722a2e46bcc595fb67990c8b6a4c9dab1c6bb9e6ae4d69cb81d08ff5a04fa4767b0df4747716a5f87d14fc8d48ff947a438142850129e4a9@135.181.2.253:30303
#  curl localhost:4000/eth/v1/node/identity | jq
export CL_BOOTNODES=enr:-Mq4QC0y16wKd4BrnoJEShek6cF42IF0oizBZm2ZkSqYHpQhZJ1KTGeaKQNOcp9gQAPdD_iiHenBKNZLS8TO1PlewimGAZZbmMCkh2F0dG5ldHOIAAAAADAAAACEZXRoMpB7FvtmcAAAAf__________gmlkgnY0gmlwhIe1Av2EcXVpY4IyyIlzZWNwMjU2azGhAvZO9zDLsWXymr4FV7RbVpQTGLlKcB9ve6eitqpyFCMxiHN5bmNuZXRzD4N0Y3CCMsiDdWRwgi7g
export CL_STATICPEERS=/ip4/135.181.2.253/tcp/13000/p2p/16Uiu2HAmC1A7QPSMoNSUBmGjVdpmBzrQHe2Bk18ffD63HPKyfyr8

if [ -z "$IP_ADDRESS" ]; then
    echo "Failed to retrieve IP address"
    exit 1
fi

echo "Using IP address: $IP_ADDRESS"

docker compose -f normal-docker-compose.yml up -d
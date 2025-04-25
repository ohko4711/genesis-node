export IP_ADDRESS=$(curl -4 ifconfig.io)

if [ -z "$IP_ADDRESS" ]; then
    echo "Failed to retrieve IP address"
    exit 1
fi

echo "Using IP address: $IP_ADDRESS"


# mev-builder and mev-boost-relay in same machine
export BEACON_URLS=http://${IP_ADDRESS}:5052

# rbuilder json-rpc-port is used for searcher or normal user send boundle tx
# for mev-boost relay use EXECUTION_URL which enable rpc flashbots_*** for sim
export EXECUTION_URL=http://${IP_ADDRESS}:8545

docker compose up -d

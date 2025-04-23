
export IP_ADDRESS=$(curl -4 https://icanhazip.com/)

#  docker compose logs 2>&1 | grep 'enode'
export EL_BOOTNODES=enode://6c0fb9555b62e5c8adaa8e957928a5c4dd5ebf6d12454fc93b8f4101ea39c2917fefafbd56e64d8eb2b8e4b29810ac6ea048ea6b166fa4bad89b03351bfd5f88@135.181.2.253:30303
#  curl localhost:4000/eth/v1/node/identity | jq
export CL_BOOTNODES=enr:-Mq4QCnqHYHPd2lP1mZNxDQjnapWo9HuLhU0xAI2sk6DiNPoQcq_gSST6aW1I_vYJ0nG6VaqA2nNgm6O9GtWtE5WNDKGAZZjIWZ0h2F0dG5ldHOIAAAAAAAAGACEZXRoMpALDY_qYAAAATIAAAAAAAAAgmlkgnY0gmlwhIe1Av2EcXVpY4IyyIlzZWNwMjU2azGhAhn8flxkaWoGlIuKvVJlKG4T1oLDmW3MZcs9Ho77xHBWiHN5bmNuZXRzD4N0Y3CCMsiDdWRwgi7g
export CL_STATICPEERS=/ip4/135.181.2.253/tcp/13000/p2p/16Uiu2HAkwB7UjpXTnQ6AE8ZZqWrPHUWfcrKyDDoH4UJKvBvv9fBB

if [ -z "$IP_ADDRESS" ]; then
    echo "Failed to retrieve IP address"
    exit 1
fi

echo "Using IP address: $IP_ADDRESS"

docker compose -f docker-compose.yml up -d
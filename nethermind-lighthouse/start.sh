
export IP_ADDRESS=$(curl -4 https://icanhazip.com/)

#  docker compose logs 2>&1 | grep 'enode'
export EL_BOOTNODES=enode://6c0fb9555b62e5c8adaa8e957928a5c4dd5ebf6d12454fc93b8f4101ea39c2917fefafbd56e64d8eb2b8e4b29810ac6ea048ea6b166fa4bad89b03351bfd5f88@135.181.2.253:30303
#  curl localhost:4000/eth/v1/node/identity | jq
export CL_BOOTNODES=enr:-Mq4QEQL-Q0iXAkprmqwYIPK2xdDycdaira3oZizQkuO_d2vdn7Gz6YA91LXh9lY0Z69M70FKP4WPTYijpbj0AnnrK-GAZZ6cNsNh2F0dG5ldHOIAADAAAAAAACEZXRoMpAi2M7dcAAAAf__________gmlkgnY0gmlwhIe1Av2EcXVpY4IyyIlzZWNwMjU2azGhAhn8flxkaWoGlIuKvVJlKG4T1oLDmW3MZcs9Ho77xHBWiHN5bmNuZXRzD4N0Y3CCMsiDdWRwgi7g,enr:-Ly4QBMU_aAiSvjPt6PxJ9YfmFBCveqdaczMv_X0S6vhRw2AEvnzwcI3mwnPRwLezpAJCzefOhfRK2tF0Utl7sbushsHh2F0dG5ldHOIGAAAAAAAAACEZXRoMpAi2M7dYAAAAf__________gmlkgnY0gmlwhDmbtReJc2VjcDI1NmsxoQNw8WTRsoQ2CDdx2-DdWc4rqR_gKGScyAEpwHHvl_Q5FYhzeW5jbmV0cw-DdGNwgi4Yg3VkcIIuGA
export CL_STATICPEERS=/ip4/135.181.2.253/tcp/13000/p2p/16Uiu2HAkwB7UjpXTnQ6AE8ZZqWrPHUWfcrKyDDoH4UJKvBvv9fBB
export CL_TRUSTPEERS=16Uiu2HAkwB7UjpXTnQ6AE8ZZqWrPHUWfcrKyDDoH4UJKvBvv9fBB,16Uiu2HAmLFsW7LPGcE26AFaj4FkYjeLGJC7eoAuD814U2mfzU2yz 
export CL_CHECKPOINTZ_URL=http://135.181.2.253:9781

if [ -z "$IP_ADDRESS" ]; then
    echo "Failed to retrieve IP address"
    exit 1
fi

echo "Using IP address: $IP_ADDRESS"

docker compose -f docker-compose.yml up -d
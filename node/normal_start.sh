
export IP_ADDRESS=$(curl -4 https://icanhazip.com/)
export EL_BOOTNODES=enode://e28c2a4cb78824496a0fb7412c0939e7927141f1c5b2000a5b4017dc3fb1e95b3d239a7a7bbcfdcc086f776f1086b6fbd397006999a9513c0652764d9444db7d@159.223.69.141:30303
export CL_BOOTNODES=enr:-Mq4QJftjSIm8l6C5CpbTjhpWmH4qHyQh4mVNVjfa7EbDQTeZPSq9UYIkKcXe_TkeOgrYSSjFUCxhqNFXkkhU5EH9ySGAZZDpDUrh2F0dG5ldHOIAAAAAAAGAACEZXRoMpBbbO2wYAAAACAAAAAAAAAAgmlkgnY0gmlwhJ_fRY2EcXVpY4IyyIlzZWNwMjU2azGhA6hwftzefFdjZCtm5Ii44WEjIZwIBpSqAu17i6dJJI9ZiHN5bmNuZXRzD4N0Y3CCMsiDdWRwgi7g
export CL_STATICPEERS=/ip4/159.223.69.141/tcp/13000/p2p/16Uiu2HAmPzWLQrTLcV6XDWG5DT4NFRuYWFd1tfCihfnRXddTEcFS

if [ -z "$IP_ADDRESS" ]; then
    echo "Failed to retrieve IP address"
    exit 1
fi

echo "Using IP address: $IP_ADDRESS"

docker compose -f normal-docker-compose.yml up -d
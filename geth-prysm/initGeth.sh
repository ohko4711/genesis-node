

docker run \
  --rm \
  -it \
  -v $(pwd)/execution-data:/execution-data \
  -v $(pwd)/../el-cl-genesis-data:/el-cl-genesis-data \
  ethereum/client-go:latest \
  --state.scheme=path \
  --datadir=/execution-data \
  init \
  /el-cl-genesis-data/custom_config_data/genesis.json


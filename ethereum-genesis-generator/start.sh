mkdir -p ../el-cl-genesis-data

docker run \
  --rm -it -v $PWD/../el-cl-genesis-data:/data \
  -v $PWD/config/values.env:/config/values.env \
  ethpandaops/ethereum-genesis-generator:master all


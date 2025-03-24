# genesis-node

从头启动一个私有POS网络
- ethereum-genesis-generator 生成genesis file
- docker compose 启动EL/CL/VN 以及dora explorer等周边服务

## 目录结构

```
.
├── README.md
├── dora
├── ethereum-genesis-generator  // https://github.com/ethpandaops/ethereum-genesis-generator
└── node // EL-CL-VN docker-compose

```

### ethereum-genesis-generator

- docker 默认读取配置values.env; 需要指定不同链配置时,使用指定配置覆盖values.env


## debug

- `Exception: Missing environment variable: EL_PREMINE_ADDRS`



`Cannot determine validator ETH1 deposit block number`

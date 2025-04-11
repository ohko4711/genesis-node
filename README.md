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

## 流程
- 生成genesis files
-  `./node/deposit` 生成validator keys


### ethereum-genesis-generator

- docker 默认读取配置values.env; 需要指定不同链配置时,使用指定配置覆盖values.env


### generate validator keys 

```
cd node/ethstaker-deposit-cli 

install env ref:https://deposit-cli.ethstaker.cc/other_install_options.html#option-2-build-deposit-cli-with-virtualenv

python3 -m ethstaker_deposit existing-mnemonic  --num_validators=64 --validator_start_index=0 --withdrawal_address "0x55A4255DcD8e41B588Fb54E11Afc8A34D791ab1d" --mnemonic "sleep moment list remain like wall lake industry canvas wonder ecology elite duck salad naive syrup frame brass utility club odor country obey pudding" --mnemonic_language=english  --folder=.. --keystore_password=0123456789.eth  --chain custom
```

**prsym** 导入validator:
```
cd node
./prysm-importWallet.sh
```

## debug

- `Exception: Missing environment variable: EL_PREMINE_ADDRS`



`Cannot determine validator ETH1 deposit block number`


**查询validator**

用于检查0x1 upgrade to 0x2 何时生效

```
curl -X GET http://localhost:4000/eth/v1/beacon/states/head/validators/0xaa4545eae1ffe47cb4e48d1aa640e7994acdc9c976581c4a1bbf4ec34cbf2cad516e58e31e104a6bc26659cb6617674f

```
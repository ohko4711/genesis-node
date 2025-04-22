make all:
	# 1. 生成 genesis 数据 
	rm -rf ../el-cl-genesis-data && cd ../ethereum-genesis-generator && ./start.sh 

	# 2. 启动节点
	./down.sh && ./clean.sh && ./initGeth.sh && ./start.sh 
make node:
	./down.sh && ./clean.sh && ./initGeth.sh && ./start.sh 

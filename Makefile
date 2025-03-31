make all:
	# 1. 生成 genesis 数据 
	cd ethereum-genesis-generator && rm -rf ../el-cl-genesis-data && ./start.sh 

	# 2. 启动节点
	cd node && ./down.sh && ./clean.sh && ./start.sh 
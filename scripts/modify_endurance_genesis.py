import json

# 读取 genesis.json
with open("genesis.json", "r") as f:
    data = json.load(f)

# 修改 config 部分
data["config"]["blobSchedule"] = {
    "cancun": {
        "target": 3,
        "max": 6,
        "baseFeeUpdateFraction": 3338477
    },
    "prague": {
        "target": 6,
        "max": 9,
        "baseFeeUpdateFraction": 5007716
    }
}

# 修改 pragueTime（TODO: 需要根据实际情况修改）
data["config"]["pragueTime"] = 1722333828

# 写回 genesis.json
with open("genesis.json", "w") as f:
    json.dump(data, f, indent=2)

# 验证插入字段
assert "blobSchedule" in data["config"], "blobSchedule 插入失败"
assert "pragueTime" in data["config"], "pragueTime 插入失败"
print("修改完成，所有字段验证通过")

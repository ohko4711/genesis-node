docker run \
  --rm \
  -it \
  --user=root \
  -v $(pwd)/validator_keys:/validator_keys \
  -v $(pwd)/password.txt:/password.txt \
  gcr.io/prysmaticlabs/prysm/validator:v5.0.0 \
  wallet create \
  --wallet-dir=/validator_keys \
  --wallet-password-file=/password.txt \

docker run \
  --rm \
  -it \
  --user=root \
  -v $(pwd)/validator_keys:/validator_keys \
  -v $(pwd)/password.txt:/password.txt \
  gcr.io/prysmaticlabs/prysm/validator:v5.0.0 \
  accounts import \
  --wallet-dir=/validator_keys \
  --wallet-password-file=/password.txt \
  --keys-dir=/validator_keys \
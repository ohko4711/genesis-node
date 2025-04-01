docker run \
  --rm \
  -it \
  --user=root \
  -v $(pwd)/validator_keys:/validator_keys \
  -v $(pwd)/password.txt:/password.txt \
  gcr.io/prysmaticlabs/prysm/validator:v5.3.2 \
  wallet create \
  --wallet-dir=/validator_keys \
  --wallet-password-file=/password.txt \
  --accept-terms-of-use
docker run \
  --rm \
  -it \
  --user=root \
  -v $(pwd)/validator_keys:/validator_keys \
  -v $(pwd)/password.txt:/password.txt \
  gcr.io/prysmaticlabs/prysm/validator:v5.3.2 \
  accounts import \
  --wallet-dir=/validator_keys \
  --wallet-password-file=/password.txt \
  --keys-dir=/validator_keys \
  --accept-terms-of-use


  # other useful commands
  # docker run --rm -it gcr.io/prysmaticlabs/prysm/validator:v5.3.2 accounts list --wallet-dir=/validator_keys --wallet-password-file=/password.txt --accept-terms-of-use

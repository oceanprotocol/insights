# Create Ocean instance
from ocean_lib.example_config import get_config_dict
from ocean_lib.ocean.ocean import Ocean
from ocean_lib.ocean.util import to_wei, from_wei

config = get_config_dict("development")

ocean = Ocean(config)

OCEAN = ocean.OCEAN_token

from ocean_lib.ocean.mint_fake_ocean import mint_fake_OCEAN
mint_fake_OCEAN(config)

# Create Alice's wallet
import os
from eth_account import Account

alice_private_key = os.getenv("TEST_PRIVATE_KEY1")
alice = Account.from_key(private_key=alice_private_key)
assert ocean.wallet_balance(alice) > 0, "Alice needs ETH"
assert OCEAN.balanceOf(alice) > 0, "Alice needs OCEAN"

# Create additional wallets. While some flows just use Alice wallet, it's simpler to do all here.
bob_private_key = os.getenv('TEST_PRIVATE_KEY2')
bob = Account.from_key(private_key=bob_private_key)
assert ocean.wallet_balance(bob) > 0, "Bob needs ETH"
assert OCEAN.balanceOf(bob) > 0, "Bob needs OCEAN"

carlos_private_key = os.getenv('TEST_PRIVATE_KEY3')
carlos = Account.from_key(private_key=carlos_private_key)
assert ocean.wallet_balance(carlos) > 0, "Carlos needs ETH"
assert OCEAN.balanceOf(carlos) > 0, "Carlos needs OCEAN"


# Specify metadata, using the peppers.tiff image
DATA_date_created = "2021-12-28T10:55:11Z"
DATA_metadata = {
    "created": DATA_date_created,
    "updated": DATA_date_created,
    "description": "peppers image",
    "name": "peppers",
    "type": "dataset",
    "author": "Ocean Protocol Foundation",
    "license": "CC0: PublicDomain",
}

from ocean_lib.structures.file_objects import UrlFile
DATA_url_file = UrlFile(
    url="https://raw.githubusercontent.com/oceanprotocol/c2d-examples/main/peppers_and_grayscale/peppers.tiff"
)

name = "Branin dataset"
(DATA_data_nft, DATA_datatoken, DATA_ddo) = ocean.assets.create_url_asset(name, DATA_url_file.url, {"from": alice}, metadata= DATA_metadata, with_compute=True, wait_for_aqua=True)
print(f"DATA_data_nft address = '{DATA_data_nft.address}'")
print(f"DATA_datatoken address = '{DATA_datatoken.address}'")

print(f"DATA_ddo did = '{DATA_ddo.did}'")

# Publish data NFT & datatoken for algorithm
ALGO_url = "<HOSTED_ALGO_URL>"

name = "image processing"
(ALGO_data_nft, ALGO_datatoken, ALGO_ddo) = ocean.assets.create_algo_asset(name, ALGO_url, {"from": alice}, wait_for_aqua=True)

print(f"ALGO_data_nft address = '{ALGO_data_nft.address}'")
print(f"ALGO_datatoken address = '{ALGO_datatoken.address}'")
print(f"ALGO_ddo did = '{ALGO_ddo.did}'")

compute_service = DATA_ddo.services[1]
compute_service.add_publisher_trusted_algorithm(ALGO_ddo)
DATA_ddo = ocean.assets.update(DATA_ddo, {"from": alice})

from ocean_lib.ocean.util import to_wei
DATA_datatoken.mint(bob, to_wei(5), {"from": alice})
ALGO_datatoken.mint(bob, to_wei(5), {"from": alice})


DATA_did = DATA_ddo.did
ALGO_did = ALGO_ddo.did

# Operate on updated and indexed assets
DATA_ddo = ocean.assets.resolve(DATA_did)
ALGO_ddo = ocean.assets.resolve(ALGO_did)

compute_service = DATA_ddo.services[1]
algo_service = ALGO_ddo.services[0]
free_c2d_env = ocean.compute.get_free_c2d_environment(compute_service.service_endpoint, DATA_ddo.chain_id)

from datetime import datetime, timedelta, timezone
from ocean_lib.models.compute_input import ComputeInput

DATA_compute_input = ComputeInput(DATA_ddo, compute_service)
ALGO_compute_input = ComputeInput(ALGO_ddo, algo_service)

# Pay for dataset and algo for 1 day
datasets, algorithm = ocean.assets.pay_for_compute_service(
    datasets=[DATA_compute_input],
    algorithm_data=ALGO_compute_input,
    consume_market_order_fee_address=bob.address,
    tx_dict={"from": bob},
    compute_environment=free_c2d_env["id"],
    valid_until=int((datetime.now(timezone.utc) + timedelta(days=1)).timestamp()),
    consumer_address=free_c2d_env["consumerAddress"],
)
assert datasets, "pay for dataset unsuccessful"
assert algorithm, "pay for algorithm unsuccessful"

# Start compute job
job_id = ocean.compute.start(
    consumer_wallet=bob,
    dataset=datasets[0],
    compute_environment=free_c2d_env["id"],
    algorithm=algorithm,
)
print(f"Started compute job with id: {job_id}")

status = ocean.compute.status(DATA_ddo, compute_service, job_id, bob)




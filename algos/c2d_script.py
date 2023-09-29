# Create Ocean instance
from ocean_lib.example_config import get_config_dict
from ocean_lib.ocean.ocean import Ocean
from ocean_lib.ocean.util import to_wei

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


# Specify metadata, using the peppers.tiff image
DATA_date_created = "2021-12-28T10:55:11Z"
DATA_metadata = {
    "created": DATA_date_created,
    "updated": DATA_date_created,
    "description": "filtered image",
    "name": "image processing",
    "type": "dataset",
    "author": "Ocean Protocol Foundation",
    "license": "CC0: PublicDomain",
}

from ocean_lib.structures.file_objects import UrlFile
from ocean_lib.models.dispenser import DispenserArguments
DATA_url_file = UrlFile(
    url="https://raw.githubusercontent.com/CkauNui/ckau-book-addons-Colorful-4K-Images/main/ckau-book-addons/_inc/anim/4K/bbcmicro.png"
)

name = "Image processing dataset"
(DATA_data_nft, DATA_datatoken, DATA_ddo) = ocean.assets.create_url_asset(name, DATA_url_file.url, {"from": alice}, metadata= DATA_metadata, with_compute=True, pricing_schema_args=DispenserArguments(to_wei(1), to_wei(1)), wait_for_aqua=True)
print(f"DATA_data_nft address = '{DATA_data_nft.address}'")
print(f"DATA_datatoken address = '{DATA_datatoken.address}'")

print(f"DATA_ddo did = '{DATA_ddo.did}'")

image_filter = "blur"

# Publish data NFT & datatoken for algorithm
ALGO_date_created = "2021-12-28T10:55:11Z"
ALGO_metadata = {
    "created": ALGO_date_created,
    "updated": ALGO_date_created,
    "description": "image processing",
    "name": "image processing",
    "type": "algorithm",
    "author": "Ocean Protocol Foundation",
    "license": "CC0: PublicDomain",
    "algorithm": {
        "language": "python",
        "format": "docker-image",
        "version": "0.1",
        "container": {
            "entrypoint": f"python $ALGO",
            "image": "oceanprotocol/algo_dockers",
            "tag": "image-processing",  # This image provides all the dependencies of the image-processing.py algorithm
            "checksum": "sha256:1901f1642ec7c2b67f6887d233ad945756216a1946854809d769a760a285a126",
        },
        "consumerParameters": [
            {
                "name": "did",
                "type": "string",
                "label": "did",
                "required": True,
                "default": f"{DATA_ddo.did}",
                "description": "This parameter is the dataset DID which contains the image.",
            },
            {
                "name": "image_filter",
                "type": "string",
                "label": "filter",
                "required": True,
                "default": "blur",
                "description": "This parameter filters the image from the dataset.",
            }
            ],
    }
}
ALGO_url = "https://raw.githubusercontent.com/oceanprotocol/c2d-examples/main/image_processing/image_processing.py"

(ALGO_data_nft, ALGO_datatoken, ALGO_ddo) = ocean.assets.create_algo_asset(name, ALGO_url, {"from": alice}, image="oceanprotocol/algo_dockers", tag="image-processing", checksum="sha256:7421d79ecd1a280d41aa72bbc9b7c1ec03e4e706551ad7b9caf9f2fbdada5ac4", metadata=ALGO_metadata, pricing_schema_args=DispenserArguments(to_wei(1), to_wei(1)), wait_for_aqua=True)

print(f"ALGO_data_nft address = '{ALGO_data_nft.address}'")
print(f"ALGO_datatoken address = '{ALGO_datatoken.address}'")
print(f"ALGO_ddo did = '{ALGO_ddo.did}'")

compute_service = DATA_ddo.services[1]
compute_service.add_publisher_trusted_algorithm(ALGO_ddo)
DATA_ddo = ocean.assets.update(DATA_ddo, {"from": alice})

from ocean_lib.ocean.util import to_wei
DATA_datatoken.dispense(to_wei(1), {"from": bob})
ALGO_datatoken.dispense(to_wei(1), {"from": bob})


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

# Wait until job is done
import time
from decimal import Decimal
succeeded = False
for _ in range(0, 500):
    status = ocean.compute.status(DATA_ddo, compute_service, job_id, bob)
    if status.get("dateFinished") and Decimal(status["dateFinished"]) > 0:
        succeeded = True
        break
    time.sleep(5)

result = ocean.compute.result(DATA_ddo, compute_service, job_id, 0, bob)

from PIL import Image
import io

image = Image.open(io.BytesIO(result))
image.save("output.png")
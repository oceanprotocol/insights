import { Config, ConfigHelper } from "@oceanprotocol/lib";
import config from '../../../../config';

enum NetworkChain {
  Polygon = 137,
  Mumbai = 80001,
  Sepolia = 11155111
}

export function getOceanConfig(network: string | number): Config {
	const oceanConfig: Config = new ConfigHelper().getConfig(
    network,
    network === 'polygon' ||
      network === 'moonbeamalpha' ||
      network === 1287 ||
      network === 'bsc' ||
      network === 56 ||
      network === 'gaiaxtestnet' ||
      network === 2021000
      ? undefined
      : process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
  ) as Config;
	oceanConfig.gasFeeMultiplier =
    oceanConfig.chainId === config.network.acceptedChainId
      ? 4
      : oceanConfig.gasFeeMultiplier;
  return oceanConfig as Config;
}

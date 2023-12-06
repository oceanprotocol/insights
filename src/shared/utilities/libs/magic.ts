import { Magic } from "magic-sdk";
import config from "../../../../config";

const createMagic = (key: string) => {
  // We make sure that the window object is available
  // Then we create a new instance of Magic using a publishable key
  return (
    typeof window !== 'undefined' &&
    new Magic(key, {
      network: {
        rpcUrl: `${config.network.rpcUrl}${config.oceanApp.infuraProjectId}`,
        chainId: config.network.acceptedChainId,
      },
    })
  );
};

// Pass in your publishable key from your .env file
export const magic = createMagic(config.magicApiKey);

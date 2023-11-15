import { Magic } from "magic-sdk";
import config from "../../../../config";

// Initialize the Magic instance
// export const magic = new Magic('pk_live_FFCFB9A970D9C147', {
//   network: {
//     rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo',
//     chainId: 11155111,
//   },
// });

const createMagic = (key: string) => {
  // We make sure that the window object is available
  // Then we create a new instance of Magic using a publishable key
  return (
    typeof window !== 'undefined' &&
    new Magic(key, {
      network: {
        // rpcUrl: "https://rpc-mumbai.maticvigil.com/",
        // chainId: 80001,
        rpcUrl: 'https://sepolia.infura.io/v3/853bee732cdf4e4383f88047e46ea89d',
        chainId: 11155111,
      },
    })
  );
};

// Pass in your publishable key from your .env file
export const magic = createMagic(config.magicApiKey);

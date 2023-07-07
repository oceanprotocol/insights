import { Magic } from 'magic-sdk';
import config from '../../../../config';

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
        rpcUrl: 'https://mainnet.infura.io/v3/',
        chainId: 1,
      },
    })
  );
};

// Pass in your publishable key from your .env file
export const magic = createMagic(config.magicApiKey);

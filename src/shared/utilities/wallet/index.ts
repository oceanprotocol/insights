import { AbiItem, LoggerInstance } from '@oceanprotocol/lib';
import {
  Connector,
  configureChains,
  createConfig,
  erc20ABI,
  Chain,
  ConnectorData,
} from 'wagmi';
import { mainnet, polygon, polygonMumbai, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ethers, Contract } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import oceanAbi from '../../@ocean/abi/oceanAbi.json';

import {
  UniversalWalletConnector,
  UniversalWalletOptions,
} from '@magiclabs/wagmi-connector';
import { error } from 'console';
import Web3 from 'web3';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, polygonMumbai, sepolia],
  [publicProvider()]
);

export class MagicWalletConnector extends Connector<UniversalWalletConnector, any> {
  readonly id = 'magicwallet';
  readonly name = 'Magic Wallet';
  readonly ready = true;

  readonly isModalOpen = false;

  provider?: UniversalWalletConnector;

  constructor(config: {
    chains;
    options: {
      // apiKey: "pk_live_0E5D589855DCF6D3",
      apiKey: 'pk_live_D184E64BFC294E38';
      /* Make sure to enable OAuth options from magic dashboard */
      networks: [
        {
          rpcUrl: 'https://mainnet.infura.io/v3';
          chainId: 1;
        },
        {
          rpcUrl: 'https://polygon-rpc.com';
          chainId: 137;
        },
        {
          rpcUrl: 'https://rpc-mumbai.maticvigil.com';
          chainId: 80001;
        },
        {
          // rpcUrl: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`;
          rpcUrl: `https://sepolia.infura.io/v3/853bee732cdf4e4383f88047e46ea89d`;
          chainId: 11155111;
        }
      ];
      magicSdkConfiguration: {
        network: {
          // rpcUrl: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`;
          rpcUrl: `https://sepolia.infura.io/v3/853bee732cdf4e4383f88047e46ea89d`;
          chainId: 11155111;
        };
        extensions: true;
      };
    };
  }) {
    super(config);
  }

  async connect(config?: {
    chainId?: number;
  }): Promise<Required<ConnectorData>> {
    try {
      const wallet = await this.connect();
      return wallet;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async disconnect() {
    await this.disconnect();
  }

  async getAccount() {
    if (!this.provider) throw new Error('Wallet not connected');
    return await this.getAccount();
  }

  async getProvider() {
    if (!this.provider) {
      this.provider = new UniversalWalletConnector(this.options);
    }
    return this.provider;
  }

  async getChainId() {
    if (!this.provider) throw new Error('Wallet not connected');
    return await this.getChainId();
  }

  async getWalletClient() {
    if (!this.provider) throw new Error('Wallet not connected');
    return await this.getWalletClient();
  }

  async isAuthorized(): Promise<boolean> {
    return await this.isAuthorized();
  }

  async onAccountsChanged(accounts: `0x${string}`[]) {
    if (!this.provider) throw new Error('Wallet not connected');

    await this.onAccountsChanged(accounts);
  }

  async onChainChanged(chain: string | number) {
    await this.onChainChanged(chain);
  }

  protected async onDisconnect(error: Error) {
    await this.onDisconnect(error);
  }
}

export const wagmiClient = createConfig({
  // autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new UniversalWalletConnector({
      chains,
      options: {
        // apiKey: "pk_live_0E5D589855DCF6D3",
        apiKey: 'pk_live_D184E64BFC294E38',
        /* Make sure to enable OAuth options from magic dashboard */
        networks: [
          {
            rpcUrl: 'https://mainnet.infura.io/v3',
            chainId: 1,
          },
          {
            rpcUrl: 'https://polygon-rpc.com',
            chainId: 137,
          },
          {
            rpcUrl: 'https://rpc-mumbai.maticvigil.com',
            chainId: 80001,
          },
          {
            rpcUrl: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
            chainId: 11155111,
          },
        ],
        magicSdkConfiguration: {
          network: {
            rpcUrl: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
            chainId: 11155111,
          },
          extensions: true,
        },
      },
    }) as unknown as Connector,
    new MagicWalletConnector({
      chains,
      options: {
        // apiKey: "pk_live_0E5D589855DCF6D3",
        apiKey: 'pk_live_D184E64BFC294E38',
        /* Make sure to enable OAuth options from magic dashboard */
        networks: [
          {
            rpcUrl: 'https://mainnet.infura.io/v3',
            chainId: 1,
          },
          {
            rpcUrl: 'https://polygon-rpc.com',
            chainId: 137,
          },
          {
            rpcUrl: 'https://rpc-mumbai.maticvigil.com',
            chainId: 80001,
          },
          {
            rpcUrl: `https://sepolia.infura.io/v3/853bee732cdf4e4383f88047e46ea89d`,
            chainId: 11155111,
          },
        ],
        magicSdkConfiguration: {
          network: {
            rpcUrl: `https://sepolia.infura.io/v3/853bee732cdf4e4383f88047e46ea89d`,
            chainId: 11155111,
          },
          extensions: true,
        },
      },
    }) as unknown as Connector,
  ],
});

// ConnectKit CSS overrides
// https://docs.family.co/connectkit/theming#theme-variables
export const connectKitTheme = {
  '--ck-font-family': 'var(--font-family-base)',
  '--ck-border-radius': 'var(--border-radius)',
  '--ck-overlay-background': 'var(--background-body-transparent)',
  '--ck-modal-box-shadow': '0 0 20px 20px var(--box-shadow-color)',
  '--ck-body-background': 'var(--background-body)',
  '--ck-body-color': 'var(--font-color-text)',
  '--ck-primary-button-border-radius': 'var(--border-radius)',
  '--ck-primary-button-color': 'var(--font-color-heading)',
  '--ck-primary-button-background': 'var(--background-content)',
  '--ck-secondary-button-border-radius': 'var(--border-radius)',
};

export function accountTruncate(account: string): string | undefined {
  if (!account || account === '') return;
  const middle = account.substring(6, 38);
  const truncated = account.replace(middle, '…');
  return truncated;
}

export async function getTokenBalance(
  accountId: string,
  decimals: number,
  tokenAddress: string,
  web3Provider: Web3
): Promise<string | undefined> {
  if (!web3Provider || !accountId || !tokenAddress) return;

  try {
    const token = new web3Provider.eth.Contract(
      oceanAbi as AbiItem[],
      tokenAddress
    );
    const balance = await token.methods.balanceOf(accountId).call();
    const adjustedDecimalsBalance = `${balance}${'0'.repeat(18 - decimals)}`;

    return formatEther(adjustedDecimalsBalance);
  } catch (e) {
    LoggerInstance.error(`ERROR: Failed to get the balance: ${e.message}`);
  }
}

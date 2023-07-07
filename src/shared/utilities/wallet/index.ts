import { LoggerInstance } from '@oceanprotocol/lib';
import { createClient, erc20ABI } from 'wagmi';
import { mainnet, polygon, bsc, goerli, polygonMumbai } from 'wagmi/chains';
import { ethers, Contract } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { energyWeb, moonriver, Ethereum } from './chains';
import { getDefaultClient } from 'connectkit';

// Wagmi client
export const wagmiClient = createClient(
  getDefaultClient({
    appName: 'Ocean Token Gated',
    infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    // TODO: mapping between appConfig.chainIdsSupported and wagmi chainId
    chains: [
      mainnet,
      polygonMumbai,
      // Ethereum,
      polygon,
      // bsc,
      // energyWeb,
      // moonriver,
      goerli,
    ],
  })
);

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
  web3Provider: ethers.providers.Provider
): Promise<string | undefined> {
  if (!web3Provider || !accountId || !tokenAddress) return;

  try {
    const token = new Contract(tokenAddress, erc20ABI, web3Provider);
    const balance = await token.balanceOf(accountId);
    const adjustedDecimalsBalance = `${balance}${'0'.repeat(18 - decimals)}`;
    return formatEther(adjustedDecimalsBalance);
  } catch (e: any) {
    LoggerInstance.error(`ERROR: Failed to get the balance: ${e.message}`);
  }
}

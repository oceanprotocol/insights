import { LoggerInstance } from "@oceanprotocol/lib";
import { Connector, configureChains, createConfig, erc20ABI } from "wagmi";
import { mainnet, polygon, polygonMumbai, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ethers, Contract } from "ethers";
import { formatEther } from "ethers/lib/utils";

import { UniversalWalletConnector } from "@magiclabs/wagmi-connector";

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[mainnet, polygon, polygonMumbai, sepolia],
	[publicProvider()]
);

export const wagmiClient = createConfig({
	autoConnect: true,
	publicClient,
	webSocketPublicClient,
	connectors: [
		new UniversalWalletConnector({
			chains,
			options: {
				apiKey: "pk_live_0E5D589855DCF6D3",
				/* Make sure to enable OAuth options from magic dashboard */
				networks: [
					{
						rpcUrl: "https://mainnet.infura.io/v3",
						chainId: 1,
					},
					{
						rpcUrl: "https://polygon-rpc.com",
						chainId: 137,
					},
					{
						rpcUrl: "https://rpc-mumbai.maticvigil.com",
						chainId: 80001,
					},
					{
						rpcUrl: "https://rpc2.sepolia.org",
						chainId: 11155111,
					},
				],
				magicSdkConfiguration: {
					network: {
						rpcUrl: "https://rpc2.sepolia.org",
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
	"--ck-font-family": "var(--font-family-base)",
	"--ck-border-radius": "var(--border-radius)",
	"--ck-overlay-background": "var(--background-body-transparent)",
	"--ck-modal-box-shadow": "0 0 20px 20px var(--box-shadow-color)",
	"--ck-body-background": "var(--background-body)",
	"--ck-body-color": "var(--font-color-text)",
	"--ck-primary-button-border-radius": "var(--border-radius)",
	"--ck-primary-button-color": "var(--font-color-heading)",
	"--ck-primary-button-background": "var(--background-content)",
	"--ck-secondary-button-border-radius": "var(--border-radius)",
};

export function accountTruncate(account: string): string | undefined {
	if (!account || account === "") return;
	const middle = account.substring(6, 38);
	const truncated = account.replace(middle, "…");
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

		const adjustedDecimalsBalance = `${balance}${"0".repeat(18 - decimals)}`;

		return formatEther(adjustedDecimalsBalance);
	} catch (e: any) {
		LoggerInstance.error(`ERROR: Failed to get the balance: ${e.message}`);
	}
}

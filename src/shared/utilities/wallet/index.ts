import { LoggerInstance } from "@oceanprotocol/lib";
import { PublicClient, configureChains, createConfig, erc20ABI } from "wagmi";
import { mainnet, polygon, polygonMumbai, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ethers, Contract, formatEther } from "ethers";

import { DedicatedWalletConnector } from "@magiclabs/wagmi-connector";

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[mainnet, polygon, polygonMumbai, sepolia],
	[publicProvider()]
);

export const wagmiClient = createConfig({
	autoConnect: true,
	publicClient,
	webSocketPublicClient,
	connectors: [
		new DedicatedWalletConnector({
			chains,
			options: {
				apiKey: "pk_live_D34413A845CE453E",
				isDarkMode: true,
				/* Make sure to enable OAuth options from magic dashboard */
				oauthOptions: {
					providers: ["google", "twitter", "github"],
				},
				magicSdkConfiguration: {
					network: {
						rpcUrl: "https://rpc.ankr.com/eth",
						chainId: 1,
					},
				},
			},
		}),
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
	web3Provider: ethers.Provider
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

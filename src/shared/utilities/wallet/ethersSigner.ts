import * as React from "react";
import { type WalletClient, useWalletClient } from "wagmi";
import { BrowserProvider, JsonRpcSigner } from "ethers";

export function walletClientToSigner(walletClient: WalletClient) {
	if (walletClient) {
		const { account, chain, transport } = walletClient;
		const network = {
			chainId: chain.id,
			name: chain.name,
			ensAddress: chain.contracts?.ensRegistry?.address,
		};
		const provider = new BrowserProvider(transport, network);
		const signer = new JsonRpcSigner(provider, account.address);
		return signer;
	}
	return null;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
	const { data: walletClient } = useWalletClient({ chainId });
	return React.useMemo(
		() => (walletClient ? walletClientToSigner(walletClient) : undefined),
		[walletClient]
	);
}

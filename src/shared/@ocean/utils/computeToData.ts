import {
	Aquarius,
	Asset,
	ComputeAlgorithm,
	ComputeAsset,
	ComputeJob,
	Config,
	ConsumeMarketFee,
	Datatoken,
	ProviderComputeInitialize,
	ProviderFees,
	ProviderInstance,
	approveWei,
	downloadFileBrowser,
	getEventFromTx,
	orderAsset,
	sleep,
	UserCustomParameters,
} from "@oceanprotocol/lib";
import { Signer } from "ethers";
import { getOceanConfig } from "../utilities/ocean";

export async function startComputeJob(
	datasetDid: string,
	algoDid: string,
	chainId: number,
	signer: Signer,
	consumerParams?: UserCustomParameters
): Promise<string> {
	const config = getOceanConfig(chainId);

	const aquarius = new Aquarius(
		config.metadataCacheUri || "https://v4.aquarius.oceanprotocol.com/"
	);

	const output = {};
	const dataDdo = await aquarius.waitForAqua(datasetDid);
	if (!dataDdo) {
		console.error(
			"Error fetching DDO " + datasetDid + ".  Does this asset exists?"
		);
		return "error";
	}

	const algoDdo = await aquarius.waitForAqua(algoDid);
	if (!algoDdo) {
		console.error(
			"Error fetching DDO " + algoDid + ".  Does this asset exists?"
		);
		return "error";
	}

	const computeEnvs = await ProviderInstance.getComputeEnvironments(
		config.providerUri || "https://v4.provider.oceanprotocol.com/"
	);

	const datatoken = new Datatoken(
		signer,
		(await signer.provider.getNetwork()).chainId
	);

	const mytime = new Date();
	const computeMinutes = 5;
	mytime.setMinutes(mytime.getMinutes() + computeMinutes);
	const computeValidUntil = Math.floor(mytime.getTime() / 1000);

	const computeEnv = computeEnvs[dataDdo.chainId][0];

	const assets: ComputeAsset[] = [
		{
			documentId: dataDdo.id,
			serviceId: dataDdo.services[0].id,
			userdata: consumerParams?.dataServiceParams,
		},
	];

	const dtAddressArray = [dataDdo.services[0].datatokenAddress];
	const algo: ComputeAlgorithm = {
		documentId: algoDdo.id,
		serviceId: algoDdo.services[0].id,
		algocustomdata: consumerParams?.algoParams,
	};

	const providerInitializeComputeJob = await ProviderInstance.initializeCompute(
		assets,
		algo,
		computeEnv.id,
		computeValidUntil,
		config.providerUri || "https://v4.provider.oceanprotocol.com/",
		await signer.getAddress()
	);
	if (
		!providerInitializeComputeJob ||
		"error" in providerInitializeComputeJob.algorithm
	) {
		console.error(
			"Error initializing Provider for the compute job using dataset DID " +
				datasetDid +
				" and algorithm DID " +
				algoDid
		);
		return;
	}

	algo.transferTxId = await handleComputeOrder(
		providerInitializeComputeJob.algorithm,
		algoDdo,
		signer,
		computeEnv.consumerAddress,
		0,
		datatoken,
		config,
		providerInitializeComputeJob?.algorithm?.providerFee,
		config.providerUri || "https://v4.provider.oceanprotocol.com/"
	);
	if (!algo.transferTxId) {
		console.error(
			"Error ordering compute for algorithm with DID: " +
				algoDid +
				".  Do you have enought tokens?"
		);
		return;
	}

	for (let i = 0; i < providerInitializeComputeJob.datasets.length; i++) {
		assets[i].transferTxId = await handleComputeOrder(
			providerInitializeComputeJob.datasets[i],
			dataDdo,
			signer,
			computeEnv.consumerAddress,
			0,
			datatoken,
			config,
			providerInitializeComputeJob?.datasets[i].providerFee,
			config.providerUri || "https://v4.provider.oceanprotocol.com/"
		);
		if (!assets[i].transferTxId) {
			console.error(
				"Error ordering dataset with DID: " +
					datasetDid +
					".  Do you have enought tokens?"
			);
			return;
		}
	}
	console.log("Starting compute job ...");
	const computeJobs = (await ProviderInstance.computeStart(
		config.providerUri,
		signer,
		computeEnv.id,
		assets[0],
		algo
	)) as ComputeJob[];
	const { jobId } = computeJobs[0];
	console.log("Compute started.  JobID: " + jobId);
	return jobId;
}

export async function handleComputeOrder(
	order: ProviderComputeInitialize,
	asset: Asset,
	payerAccount: Signer,
	consumerAddress: string,
	serviceIndex: number,
	datatoken: Datatoken,
	config: Config,
	providerFees: ProviderFees,
	providerUrl: string,
	consumeMarkerFee?: ConsumeMarketFee
) {
	/* We do have 3 possible situations:
       - have validOrder and no providerFees -> then order is valid, providerFees are valid, just use it in startCompute
       - have validOrder and providerFees -> then order is valid but providerFees are not valid, we need to call reuseOrder and pay only providerFees
       - no validOrder -> we need to call startOrder, to pay 1 DT & providerFees
    */
	if (order.providerFee && order.providerFee.providerFeeAmount) {
		await approveWei(
			payerAccount,
			config,
			await payerAccount.getAddress(),
			order.providerFee.providerFeeToken,
			asset.services[0].datatokenAddress,
			order.providerFee.providerFeeAmount
		);
	}
	if (order.validOrder) {
		if (!order.providerFee) return order.validOrder;
		const tx = await datatoken.reuseOrder(
			asset.services[0].datatokenAddress,
			order.validOrder,
			order.providerFee
		);
		const reusedTx = await tx.wait();
		const orderReusedTx = getEventFromTx(reusedTx, "OrderReused");
		return orderReusedTx.transactionHash;
	}
	console.log("Ordering asset with DID: ", asset);
	console.log("Ordering asset with providerFees: ", providerFees);
	const txStartOrder = await orderAsset(
		asset,
		payerAccount,
		config,
		datatoken,
		providerUrl,
		consumerAddress,
		consumeMarkerFee,
		providerFees
	);

	const tx = await txStartOrder.wait();
	const orderStartedTx = getEventFromTx(tx, "OrderStarted");

	return orderStartedTx.transactionHash;
}

export async function waitForJobToFinish(
	datasetDid: string,
	jobId: string,
	chainId: number,
	signer: Signer
): Promise<ComputeJob> {
	const config = getOceanConfig(chainId);
	let jobStatus;
	do {
		jobStatus = (await ProviderInstance.computeStatus(
			config.providerUri,
			await signer.getAddress(),
			jobId,
			datasetDid
		)) as ComputeJob[];
		await sleep(2000);
	} while (jobStatus[0].status !== 70);
	return jobStatus[0];
}

export async function downloadJobResults(
	jobId: string,
	resultIndex: number,
	chainId: number,
	signer: Signer
) {
	const config = getOceanConfig(chainId);
	const jobResult = await ProviderInstance.getComputeResultUrl(
		config.providerUri,
		signer,
		jobId,
		resultIndex
	);
	console.log("jobResult ", jobResult);
	try {
		await downloadFileBrowser(jobResult);
	} catch (e) {
		console.log(`Download url dataset failed: ${e}`);
	}
}

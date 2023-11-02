import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import priceImg from "../../../../assets/priceImg.svg";
import rateImg from "../../../../assets/rateImg.svg";
import imageProcessingImg from "../../../../assets/imageProcessing.svg";
import videoProcessingImg from "../../../../assets/videoProcessing.svg";
import costumerImg from "../../../../assets/costumerImg.svg";
import pdfImg from "../../../../assets/pdf.svg";
import { StaticImageData } from "next/image";

export type CardPropType = {
	id: number;
	title: string;
	image: string | StaticImageData;
	text: string;
	price: string;
	downloads: string;
	datasetDid?: string;
	algoDid?: string;
};

export default function useData() {
	const { t } = useTranslation(["common"]);
	const DubaiCardData: CardPropType[] = useMemo(
		() => [
			{
				id: 1,
				title: "Price Average",
				image: priceImg,
				text: "This algorithm computes the average price of Dubai apartments by analysing curent pricing data, considering variables like number of rooms and sale listings.",
				price: "15.98 OCEAN",
				datasetDid:
					"did:op:6b3c472f8dc42213d4099829b44724e964ba523c60e73f4cc0a3607f98645819",
				algoDid:
					"did:op:e6dad856f8baeccda0acd6bdf3f410ba0ff0cf4840f52e450d819e342454ead5",
				downloads: "500",
			},
			{
				id: 2,
				title: "Occupancy Rate",
				image: rateImg,
				text: "This algorithm predicts Dubai apartment occupancy rates by analysing historical data on location, size, and pricing. This helps landlords and property managers optimise their pricing strategies.",
				price: "76.48 OCEAN",
				downloads: "650",
			},
			{
				id: 3,
				title: "Customer Segmentation",
				image: costumerImg,
				text: "This algorithm predicts the price of Dubai apartments by analysing historical pricing data, considering variables like location, size, and amenities to provide customised predictions for both rental and sale listings.",
				price: "98.25 OCEAN",
				downloads: "125",
			},
		],
		[]
	);
	const AlgoProcessingCardData: CardPropType[] = useMemo(
		() => [
			{
				id: 4,
				title: "Image Processing",
				image: imageProcessingImg,
				text: "This algorithm applies filters on an image dataset, such as: blur, grayscale, unsharp mask.",
				price: "15.98 OCEAN",
				datasetDid: "did:op:bece3008f896d9aa471cd9a52602bfafc26d8b865d4aab69f7e22a790c6621bb",
				algoDid: "did:op:469df1acf63b1cc8e4d85e8b8398d03a78d91e5960a0f096ccc804dd3ce1195d",
				downloads: "500",
			},
			{
				id: 5,
				title: "Face Detection",
				image: videoProcessingImg,
				text: "This algorithm detects human faces from a video dataset.",
				price: "76.48 OCEAN",
				datasetDid: "did:op:40544c466dce65180e409295c38f46565ca5625abf096b95f16e09dc2d2b4032",
				algoDid: "did:op:76eb60fad9984291c071d8e8ecb9bc0c4c2b5d46418d67947be620731c17bdbb",
				downloads: "650",
			},
			{
				id: 6,
				title: "Stock Report",
				image: pdfImg,
				text: "This algorithm generates a PDF report over stock market data from previous day.",
				price: "98.25 OCEAN",
				datasetDid: "did:op:5694ee61c517e9509df7640cbcabf71e77e6dfbee4e027488ae79f93a57e5cee",
				algoDid: "did:op:6ec0c0927e3599fb0b02b395210c18e1fa1e73087d33310beea7d6d578137cc2",
				downloads: "125",
			},
		],
		[]
	);

	return { DubaiCardData, AlgoProcessingCardData };
}

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import priceImg from "../../../../assets/priceImg.svg";
import rateImg from "../../../../assets/rateImg.svg";
import costumerImg from "../../../../assets/costumerImg.svg";
import sentimentImg from "../../../../assets/sentimentImg.svg";
import supportImg from "../../../../assets/supportImg.svg";
import mediaImg from "../../../../assets/mediaImg.svg";
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
				datasetDid: "dsadas",
				algoDid: "dsadsa",
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
	const TwitterCardData: CardPropType[] = useMemo(
		() => [
			{
				id: 1,
				title: "Sentiment Analysis",
				image: sentimentImg,
				text: "This algorithm classifies tweets as positive, negative, or neutral based on their content and context. It is a simple yet effective algorithm that uses probabilities to make predictions.",
				price: "15.98 OCEAN",
				downloads: "500",
			},
			{
				id: 2,
				title: "Support Vector Machine",
				image: supportImg,
				text: "This algorithm is a popular choice for sentiment analysis, as it can classify tweets as positive or negative with high accuracy. SVM is a supervised learning algorithm that uses a training dataset to create a decision boundary that separates the positive and negative tweets.",
				price: "76.48 OCEAN",
				downloads: "650",
			},
			{
				id: 3,
				title: "Convolutional Neural",
				image: mediaImg,
				text: "This algorithm is a deep learning model that can identify and extract complex features from text data. It has been shown to perform well in sentiment analysis tasks by learning patterns in the data and making accurate predictions.",
				price: "98.25 OCEAN",
				downloads: "125",
			},
		],
		[]
	);

	return { DubaiCardData, TwitterCardData };
}

export type DropdownData = {
	id: number;
	name: string;
};

export function useOptionsDropdown() {
	const DropdownData = [
		{
			id: 1,
			name: "Price per m2",
		},
		{
			id: 2,
			name: "Location",
		},
		{
			id: 3,
			name: "Time on market",
		},
		{
			id: 4,
			name: "Occupancy rate",
		},
		{
			id: 5,
			name: "Property size",
		},
		{
			id: 6,
			name: "Property type",
		},
		{
			id: 7,
			name: "Enter your tweet",
		},
		{
			id: 8,
			name: "# Category",
		},
		{
			id: 9,
			name: "Enter your tweet",
		},
		{
			id: 10,
			name: "Emotion",
		},
		{
			id: 11,
			name: "Emotion",
		},
		{
			id: 12,
			name: "Topic",
		},
	];

	return { DropdownData };
}

export function useImageProcessing() {
	const ImageDataDropdown = [
		{
			id: 1,
			name: "Blur",
		},
		{
			id: 2,
			name: "Sharp",
		},
		{
			id: 3,
			name: "Grayscale",
		},
	];

	return { ImageDataDropdown };
}

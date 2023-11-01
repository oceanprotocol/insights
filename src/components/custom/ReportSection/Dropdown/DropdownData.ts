export type DropdownData = {
	id: number;
	name: string;
	placeholder: string;
};

export function useOptionsDropdown() {
	const DropdownData = [
		{
			id: 1,
			placeholder: "Option",
			name: "Price per m2",
		},
		{
			id: 2,
			placeholder: "Option",
			name: "Location",
		},
		{
			id: 3,
			placeholder: "Option",
			name: "Time on market",
		},
		{
			id: 4,
			placeholder: "Option",
			name: "Occupancy rate",
		},
		{
			id: 5,
			placeholder: "Option",
			name: "Property size",
		},
		{
			id: 6,
			placeholder: "Option",
			name: "Property type",
		},
		{
			id: 7,
			placeholder: "Option",
			name: "Enter your tweet",
		},
		{
			id: 8,
			placeholder: "Option",
			name: "# Category",
		},
		{
			id: 9,
			placeholder: "Option",
			name: "Enter your tweet",
		},
		{
			id: 10,
			placeholder: "Option",
			name: "Emotion",
		},
		{
			id: 11,
			placeholder: "Option",
			name: "Emotion",
		},
		{
			id: 12,
			placeholder: "Option",
			name: "Topic",
		},
	];

	const NrOfRoomsDataDropdown = [
		{
			id: 1,
			placeholder: "Nr of rooms",
			name: "1",
		},
		{
			id: 2,
			placeholder: "Nr of rooms",
			name: "2",
		},
		{
			id: 3,
			placeholder: "Nr of rooms",
			name: "3",
		},
		{
			id: 4,
			placeholder: "Nr of rooms",
			name: "4",
		},
	];

	return { DropdownData, NrOfRoomsDataDropdown };
}

export function useImageProcessing() {
	const ImageDataDropdown = [
		{
			id: 1,
			placeholder: "Image Filter",
			name: "Blur",
		},
		{
			id: 2,
			placeholder: "Image Filter",
			name: "Unsharp Mask",
		},
		{
			id: 3,
			placeholder: "Image Filter",
			name: "Grayscale",
		},
	];

	return { ImageDataDropdown };
}

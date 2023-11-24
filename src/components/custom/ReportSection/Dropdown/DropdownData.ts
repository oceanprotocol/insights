export type DropdownData = {
	id: number;
	name: string;
	placeholder: string;
};

export function useOptionsDropdown() {
	const DropdownData = [
    {
      id: 1,
      placeholder: 'Option',
      name: 'Price per m2',
    },
    {
      id: 2,
      placeholder: 'Option',
      name: 'Location',
    },
    {
      id: 3,
      placeholder: 'Option',
      name: 'Time on market',
    },
    {
      id: 4,
      placeholder: 'Option',
      name: 'Occupancy rate',
    },
    {
      id: 5,
      placeholder: 'Option',
      name: 'Property size',
    },
    {
      id: 6,
      placeholder: 'Option',
      name: 'Property type',
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
			placeholder: "image_filter",
			name: "blur",
		},
		{
			id: 2,
			placeholder: "image_filter",
			name: "unsharp",
		},
		{
			id: 3,
			placeholder: "image_filter",
			name: "grayscale",
		},
	];

	return { ImageDataDropdown };
}

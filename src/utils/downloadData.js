export const downloadJSON = (data, filename) => {
	const jsonString = JSON.stringify(data, null, 2);
	const blob = new Blob([jsonString], { type: 'application/json' });
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = `${filename}.json`;
	a.click();

	URL.revokeObjectURL(url);
};

export const downloadFile = (fileName, content) => {
	const element = document.createElement('a');
	const file = new Blob([content], { type: 'text/plain' });

	element.href = URL.createObjectURL(file);
	element.download = fileName;
	document.body.appendChild(element); // Нужно для работы в Firefox
	element.click();
	document.body.removeChild(element);
};

import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useGetStatusRequestQuery } from '../../../../../services/tables.service';
import { truncateDescription } from '../../../../../utils/editText';

import styles from './AiTables.module.scss';

const AiTablePost = ({ id = '0' }) => {
	const dataForRequest = useSelector(state => state.dataForRequest);
	const { data: data_status, isSuccess: isSuccess_status } =
		useGetStatusRequestQuery(id);

	//HELP: Формируем данные для таблицы
	const tableData = useMemo(() => {
		if (!isSuccess_status || !dataForRequest?.texts) return [];

		// const texts = JSON.parse(data_status?.result || '{}'); //HELP: Данные для колонки "Текст"
		const texts = data_status?.results; //HELP: Данные для колонки "Текст"
		// const themes = dataForRequest.texts; //HELP: Данные для колонки "Тема"
		const themes = data_status?.texts; //HELP: Данные для колонки "Тема"

		//HELP: Объединяем данные по индексу
		return texts?.map((text, index) => {
			return {
				// text: themes[index] || 'Нет данных',
				text: themes[index] || 'Нет данных',
				theme: text,
			};
		});
	}, [isSuccess_status, data_status, dataForRequest.texts]);

	const columns = useMemo(
		() => [
			{
				header: 'Текст',
				accessorKey: 'text',
			},
			{
				header: 'Тема',
				accessorKey: 'theme',
			},
		],
		[],
	);

	const tableInstance = useReactTable({
		columns,
		data: tableData,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className={styles.wrapper_table}>
			<table>
				<thead>
					{tableInstance.getHeaderGroups().map(headerGroup => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map(header => (
								<th key={header.id}>
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{tableInstance.getRowModel().rows.map(row => (
						<tr key={row.id}>
							{row.getVisibleCells().map(cell => (
								<td key={cell.id}>
									{truncateDescription(cell.getValue()?.toString() || '', 300)}
									{/* {cell.getValue()?.toString() || ''} */}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default AiTablePost;

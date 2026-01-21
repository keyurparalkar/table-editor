import { useMachine } from "@xstate/react";
import type { MachineInput } from "../../domain/input";
import TableEditorMachine from "../../machine";
import { useGetTableProperties } from "../../machine/hooks";
import GridCell from "./grid-cell";
import GridHeader from "./grid-header";
import GridRow from "./grid-row";

type TableEditorProps = MachineInput;

const TableEditor = ({ defaultColumns, defaultRows }: TableEditorProps) => {
	const [, , actorRef] = useMachine(TableEditorMachine, {
		input: {
			defaultColumns,
			defaultRows,
		},
	});

	const {
		rowOrder,
		colOrder,
		getCellKey,
		getCellProperties,
		getColumnProperties,
		getRowProperties,
	} = useGetTableProperties({
		actorRef,
	});

	return (
		<div className="inline-block relative">
			<table>
				<thead>
					<GridRow>
						{colOrder?.map((c) => {
							const { key, ...rest } = getColumnProperties(c);

							return (
								<GridHeader key={key} className="border" {...rest}>
									{c}
								</GridHeader>
							);
						})}
					</GridRow>
				</thead>
				<tbody>
					{rowOrder?.map((r) => {
						const { key, ...rest } = getRowProperties(r);

						return (
							<GridRow key={r} {...rest}>
								{colOrder?.map((c) => {
									const cellKey = getCellKey(r, c);
									const { key, value, ...rest } = getCellProperties(cellKey);

									return (
										<GridCell key={key} className="border" {...rest}>
											{value}
										</GridCell>
									);
								})}
							</GridRow>
						);
					})}
				</tbody>
			</table>

			{/** Handle bars for add rows/columns */}
			<div
				id="table-handlebar-col"
				className="transition-all opacity-0 hover:opacity-100 hover:bg-gray-300/30 rounded h-full w-4 absolute top-0 left-full ml-2 flex flex-col justify-center items-center cursor-pointer"
			>
				<span className="text-gray-600 select-none">+</span>
			</div>
			<div
				id="table-handlebar-row"
				className="transition-all opacity-0 hover:opacity-100 hover:bg-gray-300/30 rounded h-5 w-full absolute left-0 mt-2 flex justify-center items-center cursor-pointer"
			>
				<span className="text-gray-600 select-none">+</span>
			</div>
		</div>
	);
};

export default TableEditor;

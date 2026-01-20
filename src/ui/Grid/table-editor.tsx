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
	);
};

export default TableEditor;

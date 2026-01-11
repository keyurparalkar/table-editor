import { useMachine, useSelector } from "@xstate/react";
import type { MachineInput } from "../../domain/input";
import TableEditorMachine from "../../machine";
import GridCell from "./grid-cell";
import GridHeader from "./grid-header";
import GridRow from "./grid-row";
import type { CellKey } from "../../domain/schema";

type TableEditorProps = MachineInput;
const TableEditor = ({ defaultColumns, defaultRows }: TableEditorProps) => {
	const [snapshot, send, actorRef] = useMachine(TableEditorMachine, {
		input: {
			defaultColumns,
			defaultRows,
		},
	});
	const { colOrder, colsById, rowOrder, rowsById, cells } = useSelector(
		actorRef,
		(s) => s.context.schema
	);

	return (
		<>
			<h2>Table</h2>
			<table>
				<thead>
					<GridRow>
						{colOrder?.map((c) => {
							const colProps = colsById[c];
							const width = colProps?.width;
							return (
								<GridHeader key={c} style={{ width }} className="border">
									{c}
								</GridHeader>
							);
						})}
					</GridRow>
				</thead>
				<tbody>
					{rowOrder?.map((r) => {
						const rowProps = rowsById[r];
						const height = rowProps?.height;

						return (
							<GridRow key={r} style={{ height }}>
								{colOrder?.map((c) => {
									const cellKey = `${r}:${c}` as CellKey;
									const cellProps = cells[cellKey];
									const { value } = cellProps;

									return (
										<GridCell key={cellKey} className="border">
											{value}
										</GridCell>
									);
								})}
							</GridRow>
						);
					})}
				</tbody>
			</table>
		</>
	);
};

export default TableEditor;

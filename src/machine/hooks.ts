import { useSelector } from "@xstate/react";
import type { ActorRefFrom } from "xstate";
import type TableEditorMachine from ".";
import type { CellKey, ColumnId, RowId } from "../domain/schema";

type UseGetTablePropertiesProps = {
	actorRef: ActorRefFrom<typeof TableEditorMachine>;
};

export const useGetTableProperties = ({
	actorRef,
}: UseGetTablePropertiesProps) => {
	const { colOrder, colsById, rowOrder, rowsById, cells } = useSelector(
		actorRef,
		(s) => s.context.schema,
	);

	const getColumnProperties = (colId: ColumnId) => {
		const columnProps = colsById[colId];

		const { id, name, style } = columnProps;

		return {
			id,
			key: `col-${id}`,
			"data-col-name": name,
			style,
		};
	};

	const getRowProperties = (rowId: RowId) => {
		const rowProps = rowsById[rowId];

		const { id, style } = rowProps;

		return {
			id,
			key: `row-${id}`,
			style,
		};
	};

	const getCellKey = (rowId: RowId, colId: ColumnId): CellKey =>
		`${rowId}:${colId}`;

	const getCellProperties = (cellKey: CellKey) => {
		const cellProps = cells[cellKey];

		const { kind, value, style } = cellProps;

		return {
			id: cellKey,
			key: cellKey,
			kind,
			value,
			style,
		};
	};

	return {
		colOrder,
		colsById,
		rowOrder,
		rowsById,
		cells,
		getCellKey,
		getCellProperties,
		getColumnProperties,
		getRowProperties,
	};
};

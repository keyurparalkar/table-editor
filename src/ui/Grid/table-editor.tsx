import { useMachine } from "@xstate/react";
import TableEditorMachine from "../../machine";
import type { MachineInput } from "../../domain/input";

type TableEditorProps = MachineInput;
const TableEditor = ({ defaultColumns, defaultRows }: TableEditorProps) => {
	const [snapshot] = useMachine(TableEditorMachine, {
		input: {
			defaultColumns,
			defaultRows,
		},
	});

	return <h2>Table</h2>;
};

export default TableEditor;

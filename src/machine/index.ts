import { assign, setup } from "xstate";
import type { MachineContext } from "../domain/context";
import type { MachineInput } from "../domain/input";
import { produce } from "immer";

const TableEditorMachine = setup({
	types: {
		context: {} as MachineContext,
		input: {} as MachineInput,
	},
	actions: {
		initTable: assign({
			schema: ({ context }) => {
				const {
					defaults: { columns, rows },
					schema,
				} = context;

				return produce(schema, (draftSchema) => {
					/**
					 * This is where the magic happens:
					 * - We create a rowOrder and ColumnOrder by filling it with ids. At the current moment they can be indices
					 * - Then we fill up the colsByID and rowsById objects
					 * - Then we fill up cells with empty states
					 */

					draftSchema.rowOrder = new Array(rows)
						.fill(0)
						.map((_, i) => String(i));
					draftSchema.colOrder = new Array(columns)
						.fill(0)
						.map((_, i) => String(i));

					draftSchema.rowsById = draftSchema.colOrder.reduce((acc, curr) => {
						acc[curr] = {
							id: curr,
							height: 10,
						};

						return acc;
					}, {} as MachineContext["schema"]["rowsById"]);

					draftSchema.colsById = draftSchema.colOrder.reduce((acc, curr) => {
						acc[curr] = {
							id: curr,
							name: "",
							width: 10,
						};

						return acc;
					}, {} as MachineContext["schema"]["colsById"]);
				});
			},
		}),
	},
}).createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGgBcBDAIwBswBaSASwKwCdKBbIgYwAsaMx8QAHLLDo0sGPgA9ElAGzoAntJnI0IYuSq16TVp25gAdNzp9BwgqPFIQUhABYATAsQAOAIwGAzA4cBOB54A7I6Bvm6evioqQA */
	id: "table-editor-machine",
	context: ({ input }) => ({
		defaults: {
			rows: input.defaultRows,
			columns: input.defaultColumns,
		},
		schema: {
			version: 0,

			rowOrder: [],
			colOrder: [],

			colsById: {},
			rowsById: {},

			cells: {},
		},
	}),

	initial: "init",
	states: {
		/**
		 * The task of this state is to initialize the table with default no. of rows and columns
		 * which is passed as an input to this machine
		 */
		init: {
			always: {
				actions: ["initTable"],
				target: "ready",
			},
		},

		ready: {},
	},
});

export default TableEditorMachine;

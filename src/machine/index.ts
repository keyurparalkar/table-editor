import { assign, log, setup } from "xstate";
import type { MachineContext } from "../domain/context";
import type { MachineInput } from "../domain/input";
import { produce } from "immer";

const TableEditorMachine = setup({
	types: {
		context: {} as MachineContext,
		input: {} as MachineInput,
		// TODO(Keyur): Add events typing to here based on the below events such as add.table.entities
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

					draftSchema.rowsById = draftSchema.rowOrder.reduce(
						(acc, curr) => {
							acc[curr] = {
								id: curr,
								style: {
									height: 50,
								},
							};

							return acc;
						},
						{} as MachineContext["schema"]["rowsById"],
					);

					draftSchema.colsById = draftSchema.colOrder.reduce(
						(acc, curr) => {
							acc[curr] = {
								id: curr,
								name: "",
								style: {
									width: 400,
								},
							};

							return acc;
						},
						{} as MachineContext["schema"]["colsById"],
					);

					/**
					 * We define cells as well:
					 */
					draftSchema?.rowOrder?.forEach((rO) => {
						draftSchema?.colOrder?.forEach((cO) => {
							const cellKey =
								`${rO}:${cO}` as keyof MachineContext["schema"]["cells"];

							draftSchema.cells[cellKey] = {
								kind: "empty",
								value: "",
							};
						});
					});
				});
			},
		}),
		addRow: assign({
			schema: ({ context }) => {
				const { schema } = context;

				return produce(schema, (draftSchema) => {
					const len = draftSchema.rowOrder.length;

					draftSchema.rowOrder.push(String(len));

					draftSchema.rowsById[len] = {
						id: String(len),
						style: {
							height: 50,
						},
					};

					draftSchema?.rowOrder?.forEach((rO) => {
						/**
						 * Use the colOrder from original context rather than draftContext
						 * because rowOrder is the one that is getting changed and colOrder remains unchanged.
						 */
						schema?.colOrder?.forEach((cO) => {
							const cellKey =
								`${rO}:${cO}` as keyof MachineContext["schema"]["cells"];

							draftSchema.cells[cellKey] = {
								kind: "empty",
								value: "",
							};
						});
					});
				});
			},
		}),
		addCol: assign({
			schema: ({ context }) => {
				const { schema } = context;

				return produce(schema, (draftSchema) => {
					const len = draftSchema.colOrder.length;

					draftSchema.colOrder.push(String(len));

					draftSchema.colsById[len] = {
						id: String(len),
						name: "",
						style: {
							width: 400,
						},
					};

					schema?.rowOrder?.forEach((rO) => {
						/**
						 * Use the rowOrder from original context rather than draftContext
						 * because colOrder is the one that is getting changed and colOrder remains unchanged.
						 */
						draftSchema?.colOrder?.forEach((cO) => {
							const cellKey =
								`${rO}:${cO}` as keyof MachineContext["schema"]["cells"];

							draftSchema.cells[cellKey] = {
								kind: "empty",
								value: "",
							};
						});
					});
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

		ready: {
			on: {
				"add.table.entities": {
					target: "addingTableEntities",
				},
			},
		},

		/**
		 * Entities are objects that impact the table editor's state.
		 * There are multiple types of entities:
		 * - Table entities - They deal with structural changes to the editor's state like add, removing, resizing, etc rows & cols.
		 * - Cell entities - They deal with the structural changes related to cell
		 */
		addingTableEntities: {
			initial: "decideOp",
			states: {
				decideOp: {
					always: [
						{
							guard: ({ event }) => event.payload.type === "row",
							target: "addingRow",
						},
						{
							target: "addingCol",
						},
					],
				},
				addingRow: {
					always: {
						actions: [log("Adding row"), "addRow"],
						target: "complete",
					},
				},

				addingCol: {
					always: {
						actions: [log("Adding col"), "addCol"],
						target: "complete",
					},
				},

				complete: {
					type: "final",
				},
			},
			onDone: {
				target: "#table-editor-machine.ready",
			},
		},
	},
});

export default TableEditorMachine;

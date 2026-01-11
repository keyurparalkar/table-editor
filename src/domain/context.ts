import type { Schema } from "./schema";

export type MachineContext = {
	schema: Schema;
	defaults: {
		rows: number;
		columns: number;
	};
};

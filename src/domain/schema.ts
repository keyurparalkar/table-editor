import type { CSSProperties } from "react";

type Row = {
	id: string;
	style?: Partial<CSSProperties>;
};

type Column = {
	id: string;
	name: string;
	style?: Partial<CSSProperties>;
};

export type RowId = string;
export type ColumnId = string;

export type CellKey = `${RowId}:${ColumnId}`;

type CellValue =
	| {
			kind: "text";
			value: string;
	  }
	| {
			kind: "number";
			value: number;
	  }
	| {
			kind: "empty";
			value: "";
	  };

type CellMeta = {
	style?: Omit<Partial<CSSProperties>, "width" | "height">;
};

type Cell = CellValue & CellMeta;

export type Schema = {
	version: number;

	/**
     * These are the orders that the user sees on the table.
     * We store the col and row order in this way because:
     * - Reordering becomes a cheap operation. You just need to change the id's position in the array. 
     *   Very useful in reordering, restore previous order, save view etc.
	 * 
	 * To understand the below explanation consider these two approaches:
	 * 
	 * Traditional approach:
	 * 	columns: Array<column>;
	 * 	rows: Array<row>;
	 * 
	 * Split Approach:
	 * 	colOrder: Array<ColumnId>;
	 * 	rowOrder: Array<RowId>;
	 * 
	 * 	colsById: Record<ColumnId, Column>;
	 * 	rowsById: Record<RowId, Row>;
	 * 
     * - Metadata updates don’t affect ordering (and vice versa)
            Consider changing a column width:
            Traditional approach: you update an object inside columns[]. 
            That’s fine, but if you also do reorder operations, 
            you’re constantly mutating the same structure for two orthogonal concerns.
            Split approach: width change updates colsById[colId], reorder only touches colOrder[].
            That makes operations smaller, cleaner, and easier to compose in a transaction log.
       - Works better with partial loading / virtualization
            If later you fetch row metadata separately, or only some rows are loaded:
            You can keep rowOrder as “what the view wants to show”
            and rowsById can be partially filled
     */
	colOrder: Array<ColumnId>;
	rowOrder: Array<RowId>;

	colsById: Record<ColumnId, Column>;
	rowsById: Record<RowId, Row>;

	cells: Record<CellKey, Cell>;
};

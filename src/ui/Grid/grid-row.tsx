import type { PropsWithChildren } from "react";

type GridRowProps = PropsWithChildren;

const GridRow = ({ children }: GridRowProps) => {
	return <tr>{children}</tr>;
};

export default GridRow;

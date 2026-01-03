import type { PropsWithChildren } from "react";

type GridCellProps = PropsWithChildren;

const GridCell = ({ children }: GridCellProps) => {
	return <td>{children}</td>;
};

export default GridCell;

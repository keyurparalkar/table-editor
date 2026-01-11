import type { CSSProperties, PropsWithChildren } from "react";

type GridCellProps = PropsWithChildren & {
	className?: string;
	style?: CSSProperties;
};

const GridCell = ({ children, className, style }: GridCellProps) => {
	return (
		<td className={className} style={style}>
			{children}
		</td>
	);
};

export default GridCell;

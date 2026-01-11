import type { CSSProperties, PropsWithChildren } from "react";

type GridRowProps = PropsWithChildren & {
	className?: string;
	style?: CSSProperties;
};

const GridRow = ({ children, className, style }: GridRowProps) => {
	return (
		<tr className={className} style={style}>
			{children}
		</tr>
	);
};

export default GridRow;

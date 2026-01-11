import type { CSSProperties, PropsWithChildren } from "react";

type GridHeaderProps = PropsWithChildren & {
	className?: string;
	style?: CSSProperties;
};

const GridHeader = ({ children, className, style }: GridHeaderProps) => {
	return (
		<th className={className} style={style}>
			{children}
		</th>
	);
};

export default GridHeader;

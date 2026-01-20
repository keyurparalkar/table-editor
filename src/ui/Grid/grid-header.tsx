import type { CSSProperties, PropsWithChildren } from "react";

type GridHeaderProps = PropsWithChildren & {
	className?: string;
	style?: CSSProperties;
};

const GridHeader = ({ children, className, ...rest }: GridHeaderProps) => {
	return (
		<th className={className} {...rest}>
			{children}
		</th>
	);
};

export default GridHeader;

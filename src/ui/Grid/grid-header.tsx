import type { PropsWithChildren } from "react";

type GridHeaderProps = PropsWithChildren;

const GridHeader = ({ children }: GridHeaderProps) => {
	return <th>{children}</th>;
};

export default GridHeader;

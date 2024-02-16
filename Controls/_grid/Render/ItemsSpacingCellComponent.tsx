import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import SpaceCell from 'Controls/_grid/display/SpaceCell';

interface IProps extends TInternalProps {
    column: SpaceCell;
    className?: string;
}

function ItemsSpacingCellComponent(props: IProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const className = props.column.getContentClasses();
    const dataQa = `${props.column.listElementName}_content`;
    return <div ref={ref} className={className} data-qa={dataQa}></div>;
}

export default React.forwardRef(ItemsSpacingCellComponent);

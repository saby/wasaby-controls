import * as React from 'react';

import { GridDataCell as DataCell } from 'Controls/gridDisplay';

interface IProps {
    column: DataCell;
    className: string;
}

export default function LadderWrapper(props: IProps): React.ReactElement {
    const className =
        props.column.getLadderWrapperClasses(props.column.getDisplayProperty()) +
        ` ${props.className || ''}`;

    const CellContentRender = props.column.getCellContentRender(true);
    return (
        <CellContentRender
            tooltip={props.column.getTextOverflowTitle()}
            className={className}
            column={props.column}
            value={props.column.getDisplayValue()}
            highlightedValue={props.column.getHighlightedValue()}
            {...props.column.config}
        />
    );
}

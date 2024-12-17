import * as React from 'react';

import DataCell from 'Controls/_baseGrid/display/DataCell';

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

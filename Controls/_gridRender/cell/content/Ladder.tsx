/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';

import type { GridDataCell as DataCell } from 'Controls/gridDisplay';

interface IProps {
    column: DataCell;
    className: string;
}

/**
 * Приватный платформенный компонент рендера содержимого в ячейке лесенки.
 * @private
 */
export default function Ladder(props: IProps): React.ReactElement {
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

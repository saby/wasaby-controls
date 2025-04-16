/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import {
    IColspanProps,
    IRowspanProps,
    IColumnScrollColspanProps,
    ICellPositionProps,
} from 'Controls/interface';

export interface IGetColspanRowspanProps
    extends IColspanProps,
        IRowspanProps,
        IColumnScrollColspanProps,
        ICellPositionProps {}

/**
 * Утилита, предоставляющая стили для объединения ячеек (колонки и строки)
 * @private
 */
export function getColspanRowspanStyles(props: IGetColspanRowspanProps): React.CSSProperties {
    const styles: React.CSSProperties = {};

    if (props.startColspanIndex) {
        const endIndex = !!props.cCountStart && props.isLastCell ? '-1' : props.endColspanIndex;
        styles.gridColumn = `${props.startColspanIndex} / ${endIndex || 'auto'}`;
    }
    if (props.startRowspanIndex !== undefined) {
        styles.gridRow = `${props.startRowspanIndex} / ${props.endRowspanIndex || 'auto'}`;
    }

    return styles;
}

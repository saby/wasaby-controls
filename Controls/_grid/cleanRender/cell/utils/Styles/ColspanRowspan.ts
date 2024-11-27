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

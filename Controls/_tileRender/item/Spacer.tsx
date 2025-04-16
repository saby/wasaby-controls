import {
    getHorizontalMarginsClasses,
    ITileItemHorizontalPadding,
} from 'Controls/_tileRender/utils/classes/Offset';

import * as React from 'react';

export interface ISpacerProps {
    styleProp?: React.CSSProperties;
    isLast?: boolean;
    horizontalPadding: ITileItemHorizontalPadding;
}

const SPACER_DATA_QA = 'controls-TileView__item_not_invisible';

/**
 * Компонент-распорка для вывода элементов плитки
 * @constructor
 */
export function Spacer(props: ISpacerProps) {
    let classes =
        'controls-ListView__itemV controls-TileView__item_invisible js-controls-List_invisible-for-VirtualScroll';

    if (props.isLast) {
        classes += ' controls-TreeTileView__separator';
    } else {
        classes += ' controls-TileView__item ws-flex-grow-1';
    }

    classes += ` ${getHorizontalMarginsClasses(props.horizontalPadding)}`;

    return <div className={classes} data-qa={SPACER_DATA_QA} style={props.styleProp}></div>;
}

import * as React from 'react';
import {
    ColumnScrollContext,
    NavigationComponent,
    INavigationComponentProps,
    ColumnScrollUtils,
} from 'Controls/columnScrollReact';
import { IGridViewColumnScrollProps } from '../view/interface';

export interface IScrollableHeaderComponentProps
    extends Pick<
        IGridViewColumnScrollProps,
        'columnScrollViewMode' | 'columnScrollNavigationPosition'
    > {
    hasCheckboxCell: boolean;
}

function NavigationCellComponentInner(
    props: INavigationComponentProps &
        Pick<IScrollableHeaderComponentProps, 'hasCheckboxCell'>
) {
    const context = React.useContext(ColumnScrollContext);
    const checkboxWidth = props.hasCheckboxCell ? 20 : 0;

    if (props.mode === 'scrollbar' && context.isMobile) {
        return null;
    }

    return (
        <div
            className="controls-GridReact__columnScroll__headerNavigation__wrapper"
            style={{ width: context.viewPortWidth - checkboxWidth }}
        >
            <div
                className={
                    'controls-GridReact__columnScroll__headerNavigation ' +
                    `controls-GridReact__columnScroll__headerNavigation_${props.mode}`
                }
                style={{
                    width: ColumnScrollUtils.getScrollableViewPortWidth(
                        context
                    ),
                }}
            >
                <NavigationComponent mode={props.mode} />
            </div>
        </div>
    );
}

export function NavigationCellComponent(
    props: IScrollableHeaderComponentProps
) {
    if (
        props.columnScrollViewMode === 'unaccented' ||
        props.columnScrollNavigationPosition === 'custom'
    ) {
        return null;
    }
    return (
        <NavigationCellComponentInner
            mode={props.columnScrollViewMode}
            hasCheckboxCell={props.hasCheckboxCell}
        />
    );
}

export default React.memo(NavigationCellComponent);

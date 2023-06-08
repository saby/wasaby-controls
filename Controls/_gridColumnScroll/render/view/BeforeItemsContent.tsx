import * as React from 'react';
import NavigationRow, { INavigationRowProps } from './BeforeItemsContent/NavigationRow';
import ContentObserverRow, {
    IContentObserverRowProps,
} from './BeforeItemsContent/ContentObserverRow';
import { IInnerDeviceViewProps, TColumnScrollNavigationPosition } from './interface';

export interface IBeforeItemsContentProps
    extends Omit<INavigationRowProps, 'columnScrollViewMode'>,
        Pick<Required<IInnerDeviceViewProps>, 'columnScrollViewMode'>,
        Required<IContentObserverRowProps> {
    children?: JSX.Element;
    columnScrollNavigationPosition?: TColumnScrollNavigationPosition;
}

export default React.memo(function BeforeItemsContent(
    props: IBeforeItemsContentProps
): JSX.Element {
    return (
        <>
            {props.part === 'scrollable' && (
                <ContentObserverRow
                    hasResizer={props.hasResizer}
                    stickyColumnsCount={props.stickyColumnsCount}
                    hasMultiSelectColumn={props.hasMultiSelectColumn}
                />
            )}
            {props.columnScrollViewMode !== 'unaccented' &&
                props.columnScrollNavigationPosition !== 'custom' && (
                    <NavigationRow
                        part={props.part}
                        hasResizer={props.hasResizer}
                        onScrollbarDraggingChanged={props.onScrollbarDraggingChanged}
                        columnScrollViewMode={props.columnScrollViewMode}
                        stickyColumnsCount={props.stickyColumnsCount}
                        hasMultiSelectColumn={props.hasMultiSelectColumn}
                        hasGridStickyHeader={props.hasGridStickyHeader}
                    />
                )}
            {props.children}
        </>
    );
});

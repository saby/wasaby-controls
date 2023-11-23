/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import NavigationRow, { INavigationRowProps } from './BeforeItemsContent/NavigationRow';
import AutoScrollTargets, { TAutoScrollTargetsProps } from './BeforeItemsContent/AutoScrollTargets';
import ContentObserverRow, {
    IContentObserverRowProps,
} from './BeforeItemsContent/ContentObserverRow';
import { IInnerDeviceViewProps, TColumnScrollNavigationPosition } from './interface';

export interface IBeforeItemsContentProps
    extends Omit<INavigationRowProps, 'columnScrollViewMode'>,
        Pick<Required<IInnerDeviceViewProps>, 'columnScrollViewMode'>,
        Required<IContentObserverRowProps>,
        Required<TAutoScrollTargetsProps> {
    children?: JSX.Element;
    columnScrollNavigationPosition?: TColumnScrollNavigationPosition;
    hasColumnScrollCustomAutoScrollTargets?: boolean;
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
                    endStickyColumnsCount={props.endStickyColumnsCount}
                    hasMultiSelectColumn={props.hasMultiSelectColumn}
                />
            )}
            {props.part === 'scrollable' && !props.hasColumnScrollCustomAutoScrollTargets && (
                <AutoScrollTargets
                    hasResizer={props.hasResizer}
                    stickyColumnsCount={props.stickyColumnsCount}
                    endStickyColumnsCount={props.endStickyColumnsCount}
                    hasMultiSelectColumn={props.hasMultiSelectColumn}
                    columnsCount={props.columnsCount}
                />
            )}
            {props.columnScrollViewMode !== 'unaccented' &&
                props.columnScrollNavigationPosition !== 'custom' && (
                    <NavigationRow
                        part={props.part}
                        hasResizer={props.hasResizer}
                        columnScrollViewMode={props.columnScrollViewMode}
                        stickyColumnsCount={props.stickyColumnsCount}
                        endStickyColumnsCount={props.endStickyColumnsCount}
                        hasMultiSelectColumn={props.hasMultiSelectColumn}
                        hasGridStickyHeader={props.hasGridStickyHeader}
                    />
                )}
            {props.children}
        </>
    );
});

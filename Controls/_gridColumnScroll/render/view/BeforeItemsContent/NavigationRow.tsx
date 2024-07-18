/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import NavigationComponentWrapper, {
    INavigationComponentWrapperProps,
} from './NavigationComponentWrapper';
import { StickyGroup, StickyGroupedBlock } from 'Controls/stickyBlock';
import useGridSeparatedRowStyles, {
    TUseGridSeparatedRowStylesProps,
} from './useGridSeparatedRowStyles';
import { ColumnScrollContext, IColumnScrollContext } from 'Controls/columnScrollReact';
import { QA_SELECTORS } from '../../../common/data-qa';

export interface INavigationRowProps
    extends Omit<TUseGridSeparatedRowStylesProps, 'part'>,
        Required<Pick<TUseGridSeparatedRowStylesProps, 'part'>> {
    hasGridStickyHeader: INavigationComponentWrapperProps['hasGridStickyHeader'];
    columnScrollViewMode: INavigationComponentWrapperProps['mode'];
}

const NavigationRowRender = React.memo(function InnerNavigationRow(
    props: INavigationRowProps & {
        SELECTORS: IColumnScrollContext['SELECTORS'];
    }
) {
    const { startFixedCellStyle, scrollableCellStyle, endFixedCellStyle } =
        useGridSeparatedRowStyles(props);

    const stickyBlockProps = {
        position: 'topBottom',
        mode: 'stackable',
        fixedZIndex: null,
        zIndex: null,
        backgroundStyle: props.columnScrollViewMode === 'scrollbar' ? 'transparent' : 'default',
    };

    return (
        <StickyGroup mode="stackable" position="topBottom" shadowVisibility="visible">
            <div className="tw-contents" data-qa={QA_SELECTORS.NAVIGATION_ROW}>
                {/* Фиксированная часть, выводится только в оригинальной(скроллируемой) таблице */}
                {props.part === 'scrollable' && startFixedCellStyle && (
                    <StickyGroupedBlock
                        {...stickyBlockProps}
                        attrs={{ style: startFixedCellStyle }}
                        className={
                            'controls-GridReact__navigation-cell js-controls-GridColumnScroll__cell_fixed ' +
                            props.SELECTORS.FIXED_ELEMENT
                        }
                        children={
                            <StickyContent columnScrollViewMode={props.columnScrollViewMode} />
                        }
                    />
                )}

                <StickyGroupedBlock
                    {...stickyBlockProps}
                    className={
                        'controls-GridReact__navigation-cell js-controls-GridColumnScroll__cell_scrollable'
                    }
                    attrs={{
                        style: scrollableCellStyle,
                    }}
                >
                    <StickyContent columnScrollViewMode={props.columnScrollViewMode}>
                        <NavigationComponentWrapper
                            hasGridStickyHeader={props.hasGridStickyHeader}
                            part={props.part}
                            mode={props.columnScrollViewMode}
                        />
                    </StickyContent>
                </StickyGroupedBlock>

                {/* Фиксированная часть, выводится только в оригинальной(скроллируемой) таблице */}
                {props.part === 'scrollable' && endFixedCellStyle && (
                    <StickyGroupedBlock
                        {...stickyBlockProps}
                        attrs={{ style: endFixedCellStyle }}
                        className={
                            'controls-GridReact__navigation-cell js-controls-GridColumnScroll__cell_fixed ' +
                            props.SELECTORS.FIXED_TO_RIGHT_EDGE_ELEMENT
                        }
                        children={
                            <StickyContent columnScrollViewMode={props.columnScrollViewMode} />
                        }
                    />
                )}
            </div>
        </StickyGroup>
    );
});

function StickyContent(props: {
    // То, что прислала стики шапка
    className?: string;
    style?: React.CSSProperties;
    columnScrollViewMode: INavigationRowProps['columnScrollViewMode'];
    children?: JSX.Element | React.FunctionComponent;
}): JSX.Element {
    const style: React.CSSProperties = { ...props.style };

    if (props.columnScrollViewMode === 'arrows') {
        style.minHeight = 'var(--inline_height_m)';
    }

    /* Все-таки, этот div нужен, описание по тегу #StickyContentRoot */
    return (
        <div className={props.className} style={style}>
            {props.children}
        </div>
    );
}

export default function NavigationRow(props: INavigationRowProps) {
    const ctx = React.useContext(ColumnScrollContext);
    return <NavigationRowRender {...props} SELECTORS={ctx.SELECTORS} />;
}

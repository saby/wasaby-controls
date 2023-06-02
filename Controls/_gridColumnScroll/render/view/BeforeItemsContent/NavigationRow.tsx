import * as React from 'react';
import NavigationComponentWrapper, {
    INavigationComponentWrapperProps,
} from './NavigationComponentWrapper';
import { StickyGroup, StickyGroupedBlock } from 'Controls/stickyBlock';
import useGridSeparatedRowStyles, {
    IUseGridSeparatedRowStylesProps,
} from './useGridSeparatedRowStyles';

export interface INavigationRowProps
    extends Omit<IUseGridSeparatedRowStylesProps, 'part'>,
        Required<Pick<IUseGridSeparatedRowStylesProps, 'part'>> {
    hasGridStickyHeader: INavigationComponentWrapperProps['hasGridStickyHeader'];
    columnScrollViewMode: INavigationComponentWrapperProps['mode'];
    onScrollbarDraggingChanged?: INavigationComponentWrapperProps['onDraggingChangeCallback'];
}

export default React.memo(function NavigationRow(props: INavigationRowProps) {
    const { fixedCellStyle, scrollableCellStyle } = useGridSeparatedRowStyles(props);

    const stickyBlockProps = {
        position: 'topBottom',
        mode: 'stackable',
        fixedZIndex: 5,
        zIndex: 5,
        backgroundStyle: 'default',
    };

    return (
        <StickyGroup
            mode="stackable"
            position="topBottom"
            shadowVisibility={props.columnScrollViewMode === 'scrollbar' ? 'hidden' : 'visible'}
        >
            <div className="tw-contents">
                {/* Фиксированная часть, выводится только в оригинальной(скроллируемой) таблице */}
                {props.part === 'scrollable' && (
                    <StickyGroupedBlock
                        {...stickyBlockProps}
                        attrs={{ style: fixedCellStyle }}
                        children={
                            <StickyContent columnScrollViewMode={props.columnScrollViewMode} />
                        }
                    />
                )}

                <StickyGroupedBlock
                    {...stickyBlockProps}
                    attrs={{
                        style: scrollableCellStyle,
                    }}
                >
                    <StickyContent columnScrollViewMode={props.columnScrollViewMode}>
                        <NavigationComponentWrapper
                            hasGridStickyHeader={props.hasGridStickyHeader}
                            part={props.part}
                            mode={props.columnScrollViewMode}
                            onDraggingChangeCallback={props.onScrollbarDraggingChanged}
                        />
                    </StickyContent>
                </StickyGroupedBlock>
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

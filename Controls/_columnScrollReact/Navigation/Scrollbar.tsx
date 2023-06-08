import * as React from 'react';
import { Scrollbar } from 'Controls/scrollbar';
import { getScrollableWidth } from '../common/helpers';
import { INavigationInnerComponentProps } from './interface';
import { IColumnScrollWidths } from '../common/interfaces';

const PADDINGS = { start: true, end: true };

export interface IScrollbarNavigationComponentProps
    extends INavigationInnerComponentProps,
        IColumnScrollWidths {
    position: number;
    onPositionChangeCallback?: (newPosition: number) => void;
    shouldSetMarginTop?: boolean;
}

export function ScrollbarNavigationComponent(
    props: IScrollbarNavigationComponentProps
): React.FunctionComponentElement<IScrollbarNavigationComponentProps> {
    const scrollbarContentWidth = React.useMemo(() => {
        return getScrollableWidth(props);
    }, [props.contentWidth, props.fixedWidth]);

    // TODO: Выписать на Пьянкова ошибку, что не поддержан нормальный колбек на реакте.
    const scrollbarCompatibleCallback = React.useCallback(
        (_: unknown, newPosition: number) => {
            props.onPositionChangeCallback?.(newPosition);
        },
        [props.onPositionChangeCallback]
    );

    return (
        <div className={'tw-w-full ' + (props.className || '')}>
            <Scrollbar
                position={props.position}
                contentSize={scrollbarContentWidth}
                direction="horizontal"
                thumbThickness="s"
                thumbStyle="unaccented"
                trackVisible={true}
                paddings={PADDINGS}
                shouldSetMarginTop={!!props.shouldSetMarginTop}
                onPositionchanged={scrollbarCompatibleCallback}
            />
        </div>
    );
}

export default React.memo(ScrollbarNavigationComponent);

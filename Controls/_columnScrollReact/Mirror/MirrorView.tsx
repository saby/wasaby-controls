import * as React from 'react';
import { proxyEvent } from './proxyEventUtil';
import { IScrollEventsManagerContentProps } from './ScrollEventsManager';
import { IColumnScrollWidths } from '../common/interfaces';
import { QA_SELECTORS } from '../common/data-qa';

export interface IMirrorViewProps extends IScrollEventsManagerContentProps, IColumnScrollWidths {
    className?: string;
}

export interface IMirrorViewAPI {
    setScrollPosition(position: number, smooth?: boolean): void;
}

/**
 * Представление зеркала.
 * @private
 * @constructor
 */
function MirrorView(props: IMirrorViewProps, forwardedRef: React.ForwardedRef<IMirrorViewAPI>) {
    const rootDiv = React.useRef<HTMLDivElement>();

    const setScrollPosition = React.useCallback<IMirrorViewAPI['setScrollPosition']>((position: number, smooth?: boolean) => {
        rootDiv.current.scrollTo({
            left: position,
            behavior: smooth ? 'smooth' : undefined
        });
    }, []);

    React.useImperativeHandle(
        forwardedRef,
        () => {
            return { setScrollPosition };
        },
        [setScrollPosition]
    );

    const proxiesEvents = React.useMemo(() => {
        return {
            onClick: (e: React.MouseEvent) => {
                proxyEvent(rootDiv.current, e);
            },
            onMouseDown: (e: React.MouseEvent) => {
                proxyEvent(rootDiv.current, e);
            },
            onMouseUp: (e: React.MouseEvent) => {
                proxyEvent(rootDiv.current, e);
            },
        };
    }, []);

    let className = 'controls-ColumnScrollReact__Mirror';
    if (props.className) {
        className += ` ${props.className}`;
    }

    return (
        <div
            className={className}
            data-qa={QA_SELECTORS.MIRROR}
            style={{
                left: props.fixedWidth,
                width: `calc(100% - ${props.fixedWidth}px)`,
            }}
            ref={rootDiv}
            tabIndex={-1}
            onTouchStart={props.onTouchStart}
            onTouchEnd={props.onTouchEnd}
            onScroll={(e) => {
                props.onScroll?.(e);
            }}
            {...proxiesEvents}
        >
            <div
                tabIndex={-1}
                className={'controls-ColumnScrollReact__Mirror__scroll'}
                style={{
                    width: `calc(${props.contentWidth - props.fixedWidth}px)`,
                }}
            />
        </div>
    );
}

export default React.memo(React.forwardRef(MirrorView));

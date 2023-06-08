import * as React from 'react';
import { proxyEvent } from './proxyEventUtil';
import { getScrollableViewPortWidth } from '../common/helpers';
import { IScrollEventsManagerContentProps } from './ScrollEventsManager';
import { IColumnScrollWidths } from '../common/interfaces';
import { QA_SELECTORS } from '../common/data-qa';

export interface IMirrorViewProps
    extends IScrollEventsManagerContentProps,
        IColumnScrollWidths {}

/**
 * Представление зеркала.
 * @private
 * @constructor
 */
function MirrorView(props: IMirrorViewProps) {
    const rootDiv = React.useRef<HTMLDivElement>();
    const proxiesEvents = React.useMemo(() => {
        return {
            onClick: (e: React.MouseEvent) => {
                return proxyEvent(rootDiv.current, e);
            },
            onMouseDown: (e: React.MouseEvent) => {
                return proxyEvent(rootDiv.current, e);
            },
            onMouseUp: (e: React.MouseEvent) => {
                return proxyEvent(rootDiv.current, e);
            },
        };
    }, []);

    return (
        <div
            className="controls-ColumnScrollReact__Mirror"
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
                return props.onScroll?.(e);
            }}
            {...proxiesEvents}
        >
            <div
                tabIndex={-1}
                className={'controls-ColumnScrollReact__Mirror__scroll'}
                style={{
                    width: `calc(100% + ${
                        props.contentWidth
                    }px - ${getScrollableViewPortWidth(props)}px)`,
                }}
            ></div>
        </div>
    );
}

export default React.memo(MirrorView);

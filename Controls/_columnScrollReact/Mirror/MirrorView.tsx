/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { proxyEvent } from './proxyEventUtil';
import { IScrollEventsManagerContentProps } from './ScrollEventsManager';
import { IColumnScrollWidths } from '../common/interfaces';
import { QA_SELECTORS } from '../common/data-qa';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

const getEditInPlaceLib = (): typeof import('Controls/editInPlace') => {
    return isLoaded('Controls/editInPlace') ? loadSync('Controls/editInPlace') : null;
};

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

    const setScrollPosition = React.useCallback<IMirrorViewAPI['setScrollPosition']>(
        (position: number, smooth?: boolean) => {
            rootDiv.current.scrollTo({
                left: position,
                behavior: smooth ? 'smooth' : undefined,
            });
        },
        []
    );

    React.useImperativeHandle(
        forwardedRef,
        () => {
            return { setScrollPosition };
        },
        [setScrollPosition]
    );

    const proxiesEvents = React.useMemo(() => {
        return {
            onTouchStart: (e: React.TouchEvent) => {
                props.onTouchStart?.();
                e.stopPropagation();
            },
            onTouchEnd: (e: React.TouchEvent) => {
                props.onTouchEnd?.();
                e.stopPropagation();
            },
            onClick: (e: React.MouseEvent) => {
                const event = proxyEvent(rootDiv.current, e);
                e.stopPropagation();

                const eipLib = getEditInPlaceLib();
                if (eipLib) {
                    const input = eipLib.Utils.getInput(event.target as HTMLElement);
                    input?.focus?.();
                }
            },
            onMouseDown: (e: React.MouseEvent) => {
                proxyEvent(rootDiv.current, e);
                e.stopPropagation();
            },
            onMouseUp: (e: React.MouseEvent) => {
                proxyEvent(rootDiv.current, e);
                e.stopPropagation();
            },
        };
    }, [props.onTouchEnd, props.onTouchStart]);

    let className = 'controls-ColumnScrollReact__Mirror';
    if (props.className) {
        className += ` ${props.className}`;
    }

    return (
        <div
            className={className}
            data-qa={QA_SELECTORS.MIRROR}
            style={{
                left: props.startFixedWidth,
                width: `calc(100% - ${props.startFixedWidth + props.endFixedWidth}px)`,
            }}
            ref={rootDiv}
            tabIndex={-1}
            onScroll={(e) => {
                props.onScroll?.(e);
            }}
            {...proxiesEvents}
        >
            <div
                tabIndex={-1}
                className={'controls-ColumnScrollReact__Mirror__scroll'}
                style={{
                    width: props.contentWidth - props.startFixedWidth - props.endFixedWidth,
                }}
            />
        </div>
    );
}

export default React.memo(React.forwardRef(MirrorView));

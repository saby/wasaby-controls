/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { QA_SELECTORS } from '../common/data-qa';
import {
    SCROLLABLE_PART_TARGET_NAME,
    START_FIXED_PART_TARGET_NAME,
    END_FIXED_PART_TARGET_NAME,
} from '../common/ResizerTargetsNames';
import { ResizeObserverContext, TUnobserveCallback } from '../ResizeObserver/ResizeObserverContext';

export interface IContentObserverComponentProps
    extends Required<
        Record<
            'startFixedDiv' | 'scrollableDiv' | 'endFixedDiv',
            React.ReactElement<{
                ref: React.MutableRefObject<HTMLDivElement>;
                'data-qa': string;
            }>
        >
    > {}

function useResizableDiv(
    name:
        | typeof SCROLLABLE_PART_TARGET_NAME
        | typeof START_FIXED_PART_TARGET_NAME
        | typeof END_FIXED_PART_TARGET_NAME,
    target: React.MutableRefObject<HTMLDivElement>
): void {
    const resizeObserverContext = React.useContext(ResizeObserverContext);
    const beforeRender = target.current;
    const unobserveRef = React.useRef<TUnobserveCallback>();

    React.useLayoutEffect(() => {
        if (beforeRender !== target.current) {
            unobserveRef.current?.(true);
            if (target.current) {
                unobserveRef.current = resizeObserverContext.observe(name, target.current);
            }
        }
    });

    React.useLayoutEffect(() => {
        return () => {
            unobserveRef.current?.();
        };
    }, []);
}

export default React.memo(function ContentObserverComponent(
    props: IContentObserverComponentProps
): JSX.Element {
    const startFixedDivRef = React.useRef<HTMLDivElement>();
    const endFixedDivRef = React.useRef<HTMLDivElement>();
    const scrollableDivRef = React.useRef<HTMLDivElement>();

    useResizableDiv(START_FIXED_PART_TARGET_NAME, startFixedDivRef);
    useResizableDiv(SCROLLABLE_PART_TARGET_NAME, scrollableDivRef);
    useResizableDiv(END_FIXED_PART_TARGET_NAME, endFixedDivRef);

    return (
        <>
            {props.startFixedDiv &&
                React.cloneElement(props.startFixedDiv, {
                    ref: startFixedDivRef,
                    'data-qa': QA_SELECTORS.START_FIXED_CONTENT_PART_OBSERVER,
                })}
            {React.cloneElement(props.scrollableDiv, {
                ref: scrollableDivRef,
                'data-qa': QA_SELECTORS.SCROLLABLE_CONTENT_PART_OBSERVER,
            })}
            {props.endFixedDiv &&
                React.cloneElement(props.endFixedDiv, {
                    ref: endFixedDivRef,
                    'data-qa': QA_SELECTORS.END_FIXED_CONTENT_PART_OBSERVER,
                })}
        </>
    );
});

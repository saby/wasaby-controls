/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { QA_SELECTORS } from '../common/data-qa';
import {
    SCROLLABLE_PART_TARGET_NAME,
    START_FIXED_PART_TARGET_NAME,
    END_FIXED_PART_TARGET_NAME,
} from '../common/ResizerTargetsNames';
import { useObserve, TUnobserveCallback } from 'Controls/resizeObserver';

type TObservableDiv = React.ReactElement<{
    ref: React.MutableRefObject<HTMLDivElement>;
    'data-qa': string;
    // TODO: Удалить https://online.sbis.ru/opendoc.html?guid=496aa470-a438-4638-b9dd-bf7a4e68d5c2&client=3
    'data-key': string;
}>;
export interface IContentObserverComponentProps
    extends Record<'startFixedDiv' | 'endFixedDiv', TObservableDiv | null | undefined>,
        Record<'scrollableDiv', TObservableDiv> {}

function useResizableDiv(
    name:
        | typeof SCROLLABLE_PART_TARGET_NAME
        | typeof START_FIXED_PART_TARGET_NAME
        | typeof END_FIXED_PART_TARGET_NAME,
    target: React.MutableRefObject<HTMLDivElement>
): void {
    const observeResize = useObserve();
    const beforeRender = target.current;
    const unobserveRef = React.useRef<TUnobserveCallback>();

    React.useLayoutEffect(() => {
        if (beforeRender !== target.current) {
            unobserveRef.current?.(true);
            if (target.current) {
                unobserveRef.current = observeResize(name, target.current);
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
): React.JSX.Element {
    const startFixedDivRef = React.useRef<HTMLDivElement>(undefined as unknown as HTMLDivElement);
    const endFixedDivRef = React.useRef<HTMLDivElement>(undefined as unknown as HTMLDivElement);
    const scrollableDivRef = React.useRef<HTMLDivElement>(undefined as unknown as HTMLDivElement);

    useResizableDiv(START_FIXED_PART_TARGET_NAME, startFixedDivRef);
    useResizableDiv(SCROLLABLE_PART_TARGET_NAME, scrollableDivRef);
    useResizableDiv(END_FIXED_PART_TARGET_NAME, endFixedDivRef);

    return (
        <>
            {props.startFixedDiv &&
                React.cloneElement(props.startFixedDiv, {
                    ref: startFixedDivRef,
                    'data-qa': QA_SELECTORS.START_FIXED_CONTENT_PART_OBSERVER,
                    // TODO: Удалить https://online.sbis.ru/opendoc.html?guid=496aa470-a438-4638-b9dd-bf7a4e68d5c2&client=3
                    'data-key': QA_SELECTORS.START_FIXED_CONTENT_PART_OBSERVER,
                })}
            {React.cloneElement(props.scrollableDiv, {
                ref: scrollableDivRef,
                'data-qa': QA_SELECTORS.SCROLLABLE_CONTENT_PART_OBSERVER,
                // TODO: Удалить https://online.sbis.ru/opendoc.html?guid=496aa470-a438-4638-b9dd-bf7a4e68d5c2&client=3
                'data-key': QA_SELECTORS.SCROLLABLE_CONTENT_PART_OBSERVER,
            })}
            {props.endFixedDiv &&
                React.cloneElement(props.endFixedDiv, {
                    ref: endFixedDivRef,
                    'data-qa': QA_SELECTORS.END_FIXED_CONTENT_PART_OBSERVER,
                    // TODO: Удалить https://online.sbis.ru/opendoc.html?guid=496aa470-a438-4638-b9dd-bf7a4e68d5c2&client=3
                    'data-key': QA_SELECTORS.END_FIXED_CONTENT_PART_OBSERVER,
                })}
        </>
    );
});

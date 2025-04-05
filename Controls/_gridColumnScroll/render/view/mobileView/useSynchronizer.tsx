/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import SynchronizerConnectedComponent, {
    TSynchronizerConnectedComponentAPI,
    TSynchronizerConnectedComponentProps,
} from './synchronizer/SynchronizerConnected';

function useSynchronizer(props: TSynchronizerConnectedComponentProps): {
    onResizeCallback: (container: HTMLDivElement) => void;
    SynchronizerComponent: JSX.Element;
    fakeGridStartTemplateColumns: string | null | undefined;
    fakeGridEndTemplateColumns: string | null | undefined;
} {
    const synchronizerRef = React.useRef<TSynchronizerConnectedComponentAPI>();

    const onViewResized = React.useCallback((container: HTMLDivElement) => {
        synchronizerRef.current?.updateSizes(container);
    }, []);

    return {
        onResizeCallback: onViewResized,
        fakeGridStartTemplateColumns: synchronizerRef.current?.fakeGridStartTemplateColumns,
        fakeGridEndTemplateColumns: synchronizerRef.current?.fakeGridEndTemplateColumns,
        SynchronizerComponent: (
            <SynchronizerConnectedComponent
                ref={synchronizerRef as React.MutableRefObject<TSynchronizerConnectedComponentAPI>}
                itemsSizes={props.itemsSizes}
                fixColumnScrollBeforeContainerContentSize={
                    props.fixColumnScrollBeforeContainerContentSize
                }
                fixBeforeNavigationStickyContentSize={props.fixBeforeNavigationStickyContentSize}
                hasStickyHeader={props.hasStickyHeader}
                hasStickyTopResults={props.hasStickyTopResults}
                synchronizeShadow={props.synchronizeShadow}
            />
        ),
    };
}

export default useSynchronizer;

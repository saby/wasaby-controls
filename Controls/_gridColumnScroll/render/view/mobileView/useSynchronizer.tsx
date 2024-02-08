/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import SynchronizerConnectedComponent, {
    TSynchronizerConnectedComponentAPI,
    TSynchronizerConnectedComponentProps,
} from './synchronizer/SynchronizerConnected';

function useSynchronizer(props: TSynchronizerConnectedComponentProps): {
    onResizeCallback: (container: HTMLDivElement) => void;
    SynchronizerComponent: JSX.Element;
} {
    const synchronizerRef = React.useRef<TSynchronizerConnectedComponentAPI>();

    const onViewResized = React.useCallback((container: HTMLDivElement) => {
        synchronizerRef.current.updateSizes(container);
    }, []);

    return {
        onResizeCallback: onViewResized,
        SynchronizerComponent: (
            <SynchronizerConnectedComponent
                ref={synchronizerRef}
                itemsSizes={props.itemsSizes}
                hasStickyHeader={props.hasStickyHeader}
                hasStickyTopResults={props.hasStickyTopResults}
                synchronizeShadow={props.synchronizeShadow}
            />
        ),
    };
}

export default useSynchronizer;

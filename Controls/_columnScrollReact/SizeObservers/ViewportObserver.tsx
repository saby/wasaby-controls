/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { QA_SELECTORS } from '../common/data-qa';
import { VIEWPORT_TARGET_NAME } from '../common/ResizerTargetsNames';
import { useObserve } from 'Controls/resizeObserver';

export default React.memo(function ViewportObserverComponent(): JSX.Element {
    const observeResize = useObserve();
    const ref = React.useRef<HTMLDivElement>();

    React.useLayoutEffect(() => {
        const unsubscribe = observeResize(VIEWPORT_TARGET_NAME, ref.current);
        return () => {
            unsubscribe();
        };
    }, []);

    return <div ref={ref} data-qa={QA_SELECTORS.VIEWPORT_OBSERVER} />;
});

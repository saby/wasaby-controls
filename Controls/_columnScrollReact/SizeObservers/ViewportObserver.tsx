/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { QA_SELECTORS } from '../common/data-qa';
import { VIEWPORT_TARGET_NAME } from '../common/ResizerTargetsNames';
import { useObserve } from 'Controls/resizeObserver';

export default React.memo(function ViewportObserverComponent(): React.JSX.Element {
    const observeResize = useObserve();
    const ref = React.useRef<HTMLDivElement>(undefined as unknown as HTMLDivElement);

    React.useLayoutEffect(() => {
        const unsubscribe = observeResize(VIEWPORT_TARGET_NAME, ref.current);
        return () => {
            unsubscribe();
        };
    }, []);

    return <div ref={ref} data-qa={QA_SELECTORS.VIEWPORT_OBSERVER} />;
});

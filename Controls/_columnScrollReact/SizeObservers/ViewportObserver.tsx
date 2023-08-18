import * as React from 'react';
import { QA_SELECTORS } from '../common/data-qa';
import { VIEWPORT_TARGET_NAME } from '../common/ResizerTargetsNames';
import { ResizeObserverContext } from '../ResizeObserver/ResizeObserverContext';

export default React.memo(function ViewportObserverComponent(): JSX.Element {
    const resizeObserverContext = React.useContext(ResizeObserverContext);
    const ref = React.useRef<HTMLDivElement>();

    React.useLayoutEffect(() => {
        const unsubscribe = resizeObserverContext.observe(VIEWPORT_TARGET_NAME, ref.current);
        return () => {
            unsubscribe();
        };
    }, []);

    return <div ref={ref} data-qa={QA_SELECTORS.VIEWPORT_OBSERVER} />;
});

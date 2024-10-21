import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { Bar } from 'Controls/progress';

export default React.forwardRef(function BarSize(props: TInternalProps, ref): React.ReactElement {
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    return (
        <div
            {...attrs}
            className={`controlsDemo__wrapper controlsDemo_fixedWidth350 ${attrs.className}`}
        >
            <div className="controlsDemo__cell">
                <div className="controls-text-label">size = s</div>
                <Bar value={30} size={'s'} barStyle="primary" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">size = m</div>
                <Bar value={30} size={'m'} barStyle="primary" />
            </div>
        </div>
    );
});

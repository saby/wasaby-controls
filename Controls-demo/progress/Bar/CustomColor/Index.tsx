import { Bar } from 'Controls/progress';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import 'css!Controls-demo/progress/Bar/CustomColor/CustomCOlor';
import * as React from 'react';

export default React.forwardRef(function BarSize(props: TInternalProps, ref): React.ReactElement {
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    return (
        <div
            {...attrs}
            className={`controlsDemo__wrapper controlsDemo_fixedWidth350 ${attrs.className}`}
        >
            <div className="controlsDemo__cell">
                <Bar barStyle="customBarStyle" value={30} />
            </div>
        </div>
    );
});

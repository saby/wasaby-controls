import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { StateBar } from 'Controls/progress';

export default React.forwardRef(function StateBarSize(
    props: TInternalProps,
    ref
): React.ReactElement {
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    const data = [
        {
            value: 40,
            title: 'Положительно',
            style: 'success',
        },
        {
            value: 20,
            title: 'Отрицательно',
            style: 'danger',
        },
    ];
    return (
        <div
            {...attrs}
            className={`controlsDemo__wrapper controlsDemo_fixedWidth350 ${attrs.className}`}
        >
            <div className="controlsDemo__cell">
                <div className="controls-text-label">size = s</div>
                <StateBar data={data} size={'s'} blankAreaStyle="secondary" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">size = m</div>
                <StateBar data={data} size={'m'} blankAreaStyle="secondary" />
            </div>
        </div>
    );
});

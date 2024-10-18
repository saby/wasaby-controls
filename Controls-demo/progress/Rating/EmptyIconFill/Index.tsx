import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { Rating } from 'Controls/progress';

export default React.forwardRef(function RatingDemo(
    props: TInternalProps,
    ref
): React.ReactElement {
    const [value] = React.useState<number>(3);
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    const getAttrClass = () => {
        if (props.attrs?.className) {
            return props.attrs.className;
        } else if (props.className) {
            return props.className;
        }
        return '';
    };
    return (
        <div
            {...attrs}
            className={`controlsDemo__wrapper controlsDemo_fixedWidth200 ${getAttrClass()}`}
        >
            <div className="controlsDemo__cell">
                <div className="controls-text-label">none</div>
                <Rating value={value} readOnly={true} emptyIconFill="none" />
            </div>

            <div className="controlsDemo__cell">
                <div className="controls-text-label">full</div>
                <Rating value={value} readOnly={true} emptyIconFill="full" />
            </div>
        </div>
    );
});

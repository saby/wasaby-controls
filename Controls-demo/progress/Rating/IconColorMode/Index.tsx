import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { Rating } from 'Controls/progress';

export default React.forwardRef(function RatingDemo(
    props: TInternalProps,
    ref
): React.ReactElement {
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
            className={`controlsDemo__wrapper controlsDemo_fixedWidth300 ${getAttrClass()}`}
        >
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 0</div>
                <Rating value={0} readOnly={true} iconColorMode="dynamic" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 1</div>
                <Rating value={1} readOnly={true} iconColorMode="dynamic" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 2</div>
                <Rating value={2} readOnly={true} iconColorMode="dynamic" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 3</div>
                <Rating value={3} readOnly={true} iconColorMode="dynamic" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 4</div>
                <Rating value={4} readOnly={true} iconColorMode="dynamic" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 5</div>
                <Rating value={5} readOnly={true} iconColorMode="dynamic" />
            </div>
        </div>
    );
});

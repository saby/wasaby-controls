import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { Rating } from 'Controls/progress';

export default React.forwardRef(function RatingDemo(
    props: TInternalProps,
    ref
): React.ReactElement {
    const [value, setValue] = React.useState<number>(3.56);
    const [value1, setValue1] = React.useState<number>(3.24);
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    const getAttrClass = () => {
        if (props.attrs?.className) {
            return props.attrs.className;
        } else if (props.className) {
            return props.className;
        }
        return '';
    };
    const valueChanged = (event, value): void => {
        setValue(value);
    };
    const value1Changed = (event, value): void => {
        setValue1(value);
    };
    return (
        <div
            {...attrs}
            className={`controlsDemo__wrapper controlsDemo_fixedWidth200 ${getAttrClass()}`}
            data-qa="controlsDemo_field__base_rating"
        >
            <div className="controlsDemo__cell">
                <div className="ws-flexbox">
                    <div>
                        <div className="controls-text-label">value: {value}, precision: 0</div>
                        <Rating value={value} onValueChanged={valueChanged} precision={0} />
                    </div>
                </div>
                <div className="ws-flexbox controls-padding_top-m">
                    <div>
                        <div className="controls-text-label">value: {value}, precision: 0.5</div>
                        <Rating value={value} onValueChanged={valueChanged} precision={0.5} />
                    </div>
                </div>
                <div className="ws-flexbox controls-padding_top-m">
                    <div>
                        <div className="controls-text-label">value: {value1}, precision: 0.5</div>
                        <Rating value={value1} onValueChanged={value1Changed} precision={0.5} />
                    </div>
                </div>
            </div>
        </div>
    );
});

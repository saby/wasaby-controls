import { Number } from 'Controls/input';
import { useState, forwardRef, ForwardedRef } from 'react';

const MIN_VALUE = 10;
const MAX_VALUE = 20;

export default forwardRef((_, ref: ForwardedRef<HTMLDivElement>) => {
    const [value, setValue] = useState(543);

    return (
        <div ref={ref} className="tw-flex tw-flex-col controls-margin_left-m controls-margin_top-m">
            <div>minValue = {MIN_VALUE}</div>
            <div>maxValue = {MAX_VALUE}</div>
            <div>
                <Number
                    minValue={MIN_VALUE}
                    maxValue={MAX_VALUE}
                    value={value}
                    onValueChanged={setValue}
                />
            </div>
        </div>
    );
});

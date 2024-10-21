import DatePopup from 'Controls/datePopup';
import { forwardRef } from 'react';

export default forwardRef(function Index(props, ref) {
    const startValue = new Date(2029, 0, 1);
    const endValue = new Date(2029, 0, 31);
    return (
        <div className="controlsDemo__wrapper ws-flexbox PageBlock__title" ref={ref}>
            <div>
                <DatePopup startValue={startValue} endValue={endValue} shouldPositionBelow={true} />
            </div>
        </div>
    );
});

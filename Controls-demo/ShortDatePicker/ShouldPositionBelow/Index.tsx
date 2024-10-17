import { View } from 'Controls/shortDatePicker';
import { forwardRef } from 'react';
import 'css!Controls-demo/ShortDatePicker/ShortDatePicker';

function Index(props, ref) {
    const startValue = new Date(2028, 0);
    const endValue = new Date(2028, 0, 31);

    return (
        <div className="controlsDemo__flex" style={{ justifyContent: 'center' }}>
            <View
                ref={ref}
                shouldPositionBelow={true}
                startValue={startValue}
                endValue={endValue}
                className="controlsDemo-ShortDatePicker__large"
            />
        </div>
    );
}

export default forwardRef(Index);

import { forwardRef, LegacyRef, useState, useCallback } from 'react';
import { Selector } from 'Controls/dateRange';

function CompactDatePickerAdaptiveDemo(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    const [ranges, setRanges] = useState<Date[]>([]);
    const rangeChangedHandler = useCallback((start: Date, end: Date) => {
        setRanges([start, end]);
    }, []);

    return (
        <div ref={ref}>
            <Selector
                datePopupType="compactDatePicker"
                startValue={ranges[0]}
                endValue={ranges[1]}
                onRangeChanged={rangeChangedHandler}
            />
        </div>
    );
}

export default forwardRef(CompactDatePickerAdaptiveDemo);

import Source from 'Controls-demo/CompactDatePicker/Source/resources/source';
import { Selector } from 'Controls/dateRange';
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';
import { forwardRef, LegacyRef, useCallback, useMemo, useState } from 'react';

const _date = new Date(2024, 2, 20);

export default forwardRef(function CounterPropertyCompactDatePickerDemo(
    props: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    const source = useMemo(() => new Source(), []);

    const [startValue, setStartValue] = useState(new Date(2024, 0, 2));
    const handleChangeStartValue = useCallback((date: Date) => {
        setStartValue(date);
    }, []);

    const [endValue, setEndValue] = useState(new Date(2024, 0, 19));
    const handleChangeEndValue = useCallback((date: Date) => {
        setEndValue(date);
    }, []);

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div>
                <div className="controls-text-label">CompactDatePicker с пометками</div>
                <Selector
                    datePopupType="compactDatePicker"
                    startValue={startValue}
                    endValue={endValue}
                    _date={_date}
                    onStartValueChanged={handleChangeStartValue}
                    onEndValueChanged={handleChangeEndValue}
                    size="m"
                    source={source}
                    className="controlsDemo-CompactDatePicker_height__size-m"
                />
            </div>
        </div>
    );
});

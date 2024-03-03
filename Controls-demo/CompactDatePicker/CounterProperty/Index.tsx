import { forwardRef, LegacyRef, useCallback, useMemo, useState } from 'react';
import { View as CompactDatePicker } from 'Controls/compactDatePicker';
import Source from 'Controls-demo/CompactDatePicker/Source/resources/source';
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';

export default forwardRef(function CounterPropertyCompactDatePickerDemo(
    props: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    const source = useMemo(() => new Source(), []);

    const [startValue, setStartValue] = useState(new Date(2024, 0, 2));
    const handleChangeStartValue = useCallback((event: Event, date: Date) => {
        setStartValue(date);
    }, []);

    const [endValue, setEndValue] = useState(new Date(2024, 0, 19));
    const handleChangeEndValue = useCallback((event: Event, date: Date) => {
        setEndValue(date);
    }, []);

    const onCounterClick = (event: Event, date: Date) => {
        alert(date.getDate());
    };

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div>
                <div className="controls-text-label">
                    CompactDatePicker with counterProperty = 'mainCounter'
                </div>
                <CompactDatePicker
                    startValue={startValue}
                    endValue={endValue}
                    customEvents={['onStartValueChanged', 'onEndValueChanged']}
                    onStartValueChanged={handleChangeStartValue}
                    onEndValueChanged={handleChangeEndValue}
                    size="l"
                    source={source}
                    counterProperty="mainCounter"
                    counterClickCallback={onCounterClick}
                    className="controlsDemo-CompactDatePicker_height__size-l"
                />
            </div>
        </div>
    );
});

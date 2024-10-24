import { forwardRef, LegacyRef, useCallback, useMemo, useState } from 'react';
import { View as CompactDatePicker } from 'Controls/compactDatePicker';
import { Confirmation } from 'Controls/popup';
import Source from 'Controls-demo/CompactDatePicker/Source/resources/source';
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';

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

    const onCounterClick = (event: Event, date: Date) => {
        Confirmation.openPopup({
            message: date.getDate().toString(),
            type: 'ok',
        });
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
                    _date={_date}
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

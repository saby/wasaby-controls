import { forwardRef, LegacyRef, useCallback, useState } from 'react';
import { View as CompactDatePicker } from 'Controls/compactDatePicker';

export default forwardRef(function SelectionStyleCompactDatePickerDemo(
    props: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    const [startValue, setStartValue] = useState(new Date(2024, 0, 2));
    const handleChangeStartValue = useCallback((event: Event, date: Date) => {
        setStartValue(date);
    }, []);

    const [endValue, setEndValue] = useState(new Date(2024, 0, 2));
    const handleChangeEndValue = useCallback((event: Event, date: Date) => {
        setEndValue(date);
    }, []);

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div className="tw-flex">
                <div className="controls-margin_right-2xl">
                    <div className="controls-text-label">selectionStyle не задан(default)</div>
                    <CompactDatePicker
                        startValue={startValue}
                        endValue={endValue}
                        customEvents={['onStartValueChanged', 'onEndValueChanged']}
                        onStartValueChanged={handleChangeStartValue}
                        onEndValueChanged={handleChangeEndValue}
                    />
                </div>
                <div>
                    <div className="controls-text-label">selectionStyle='brand'</div>
                    <CompactDatePicker
                        startValue={startValue}
                        endValue={endValue}
                        customEvents={['onStartValueChanged', 'onEndValueChanged']}
                        onStartValueChanged={handleChangeStartValue}
                        onEndValueChanged={handleChangeEndValue}
                        selectionStyle="brand"
                    />
                </div>
            </div>
        </div>
    );
});

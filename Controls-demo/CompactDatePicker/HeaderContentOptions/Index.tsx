import { forwardRef, LegacyRef, useCallback, useState } from 'react';
import { View as CompactDatePicker } from 'Controls/compactDatePicker';
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';

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
    const todayValue = new Date(2022, 0, 5);

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div className="tw-flex" data-qa="controlsDemo_capture">
                <div className="controls-margin_right-2xl">
                    <CompactDatePicker
                        startValue={startValue}
                        endValue={endValue}
                        _date={todayValue}
                        customEvents={['onStartValueChanged', 'onEndValueChanged']}
                        onStartValueChanged={handleChangeStartValue}
                        onEndValueChanged={handleChangeEndValue}
                        className="controlsDemo-CompactDatePicker_height__size-l"
                    />
                </div>
                <div className="controls-margin_right-2xl">
                    <div className="controls-text-label">headerMonthCaptionVisible='false'</div>
                    <CompactDatePicker
                        startValue={startValue}
                        endValue={endValue}
                        _date={todayValue}
                        customEvents={['onStartValueChanged', 'onEndValueChanged']}
                        onStartValueChanged={handleChangeStartValue}
                        onEndValueChanged={handleChangeEndValue}
                        headerMonthCaptionVisible={false}
                        className="controlsDemo-CompactDatePicker_height__size-l"
                    />
                </div>
                <div className="controls-margin_right-2xl">
                    <div className="controls-text-label">headerWeekdaysVisible='false'</div>
                    <CompactDatePicker
                        startValue={startValue}
                        endValue={endValue}
                        _date={todayValue}
                        customEvents={['onStartValueChanged', 'onEndValueChanged']}
                        onStartValueChanged={handleChangeStartValue}
                        onEndValueChanged={handleChangeEndValue}
                        headerWeekdaysVisible={false}
                        className="controlsDemo-CompactDatePicker_height__size-l"
                    />
                </div>
                <div>
                    <div className="controls-text-label">
                        <div>headerWeekdaysVisible='false'</div>
                        <div>headerMonthCaptionVisible='false'</div>
                    </div>
                    <CompactDatePicker
                        startValue={startValue}
                        endValue={endValue}
                        _date={todayValue}
                        customEvents={['onStartValueChanged', 'onEndValueChanged']}
                        onStartValueChanged={handleChangeStartValue}
                        onEndValueChanged={handleChangeEndValue}
                        headerWeekdaysVisible={false}
                        headerMonthCaptionVisible={false}
                        className="controlsDemo-CompactDatePicker_height__size-l"
                    />
                </div>
            </div>
        </div>
    );
});

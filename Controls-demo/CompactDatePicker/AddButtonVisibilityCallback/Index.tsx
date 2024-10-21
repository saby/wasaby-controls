import { forwardRef, LegacyRef, useCallback, useMemo, useState } from 'react';
import { View as CompactDatePicker } from 'Controls/compactDatePicker';
import { date as formatDate } from 'Types/formatter';
import Source from 'Controls-demo/CompactDatePicker/Source/resources/source';
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';

const _date = new Date(2024, 2, 20);

export default forwardRef(function AddButtonVisibilityCompactDatePickerDemo(
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

    const [selectedDate, setSelectedDate] = useState<string>('');

    const onCounterClick = (event: Event, date: Date) => {
        setSelectedDate(formatDate(date, 'DD.MM.YYYY'));
    };

    const addButtonVisibilityCallback = (date: Date) => {
        const maxDateWithVisibleAddButton = new Date(2024, 1, 10);
        return date >= maxDateWithVisibleAddButton;
    };

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div>
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
                    addButtonVisibilityCallback={addButtonVisibilityCallback}
                    className="controlsDemo-CompactDatePicker_height controls-margin_bottom-m"
                />
                {!!selectedDate && <div>{selectedDate}</div>}
            </div>
        </div>
    );
});

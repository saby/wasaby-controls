import { Selector } from 'Controls/dateRange';
import { useMemo, useCallback, useState, forwardRef } from 'react';
import { Label } from 'Controls/input';

function ChooseAllYears(props, ref) {
    const [startValue1, setStartValue1] = useState<Date | null>(null);
    const [endValue1, setEndValue1] = useState<Date | null>(null);

    const [startValue2, setStartValue2] = useState<Date | null>(null);
    const [endValue2, setEndValue2] = useState<Date | null>(null);

    const mockDate = useMemo(() => {
        return new Date(2024, 0, 1);
    }, []);

    const mockDateForDisplayedRanges = useMemo(() => {
        return new Date(2021, 0, 1);
    }, []);

    const displayedRanges = useMemo(() => {
        return [[new Date(2020, 0), new Date(2022, 0)]];
    }, []);

    const onStartValueChanged1 = useCallback((startValue: Date | null): void => {
        setStartValue1(startValue);
    }, []);

    const onEndValueChanged1 = useCallback((endValue: Date | null): void => {
        setEndValue1(endValue);
    }, []);

    const onStartValueChanged2 = useCallback((startValue: Date | null): void => {
        setStartValue2(startValue);
    }, []);

    const onEndValueChanged2 = useCallback((endValue: Date | null): void => {
        setEndValue2(endValue);
    }, []);
    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '400px' }}>
                <Label caption="chooseAllYears=true" />
                <Selector
                    datePopupType="shortDatePicker"
                    onStartValueChanged={onStartValueChanged1}
                    onEndValueChanged={onEndValueChanged1}
                    startValue={startValue1}
                    endValue={endValue1}
                    chooseHalfyears={false}
                    chooseMonths={false}
                    chooseQuarters={false}
                    chooseYears={true}
                    chooseAllYears={true}
                    _date={mockDate}
                    _displayDate={mockDate}
                    data-qa="Controls_ShortDatePicker__AllYears"
                />
                <Label caption="chooseAllYears=true, указан displayedRanges" />
                <Selector
                    displayedRanges={displayedRanges}
                    datePopupType="shortDatePicker"
                    onStartValueChanged={onStartValueChanged2}
                    onEndValueChanged={onEndValueChanged2}
                    startValue={startValue2}
                    endValue={endValue2}
                    chooseHalfyears={false}
                    chooseMonths={false}
                    chooseQuarters={false}
                    chooseYears={true}
                    chooseAllYears={true}
                    _date={mockDateForDisplayedRanges}
                    _displayDate={mockDateForDisplayedRanges}
                    data-qa="Controls_ShortDatePicker__AllYearsDisplayRanges"
                />
            </div>
        </div>
    );
}

export default forwardRef(ChooseAllYears);

import { forwardRef, LegacyRef, useState, useCallback } from 'react';
import { Selector } from 'Controls/dateRange';

const _date = new Date(2024, 8, 3);

export default forwardRef(function AdaptiveDatePopupDemo(
    _: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    const [startValue, setStartValue] = useState<Date | null>(null);
    const [endValue, setEndValue] = useState<Date | null>(null);
    const rangeChangedCallback = useCallback((startValue: Date, endValue: Date) => {
        setStartValue(startValue);
        setEndValue(endValue);
    }, []);

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div>
                <div className="controls-text-label controls-margin_bottom-xs">
                    Controls/dateRange:Selector с поддержкой адаптивного режима
                </div>
                <Selector
                    startValue={startValue}
                    endValue={endValue}
                    _date={_date}
                    onRangeChanged={rangeChangedCallback}
                    isAdaptive={true}
                />
            </div>
        </div>
    );
});

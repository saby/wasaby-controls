import { forwardRef, LegacyRef, useState, useCallback } from 'react';
import { Selector } from 'Controls/dateRange';

export default forwardRef(function AdaptiveDatePopupDemo(
    _: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    const [startValue, setStartValue] = useState<Date | null>(null);
    const [endValue, setEndValue] = useState<Date | null>(null);
    const rangeChangedCallback = useCallback((_: Event, startValue: Date, endValue: Date) => {
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
                    onRangeChanged={rangeChangedCallback}
                    isAdaptive={true}
                />
            </div>
        </div>
    );
});

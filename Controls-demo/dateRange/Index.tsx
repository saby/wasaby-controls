import { Input } from 'Controls/dateRange';
import { forwardRef, useState, useCallback } from 'react';

export default forwardRef(function DateRangeBaseDemo(_, ref) {
    const startDate = new Date(2023, 11, 30);
    const endDate = new Date(2023, 11, 31);

    const [firstStartValue, setFirstStartValue] = useState(startDate);
    const handleChangeFirstStartValue = useCallback((event: Event, date: Date) => {
        setFirstStartValue(date);
    }, []);

    const [firstEndValue, setFirstEndValue] = useState(endDate);
    const handleChangeFirstEndValue = useCallback((event: Event, date: Date) => {
        setFirstEndValue(date);
    }, []);

    const [secondStartValue, setSecondStartValue] = useState(startDate);
    const handleChangeSecondStartValue = useCallback((event: Event, date: Date) => {
        setSecondStartValue(date);
    }, []);

    const [secondEndValue, setSecondEndValue] = useState(endDate);
    const handleChangeSecondEndValue = useCallback((event: Event, date: Date) => {
        setSecondEndValue(date);
    }, []);

    return (
        <div ref={ref} className="tw-flex ws-justify-content-center">
            <div>
                <div className="controls-margin_bottom-xl">
                    <div className="controls-text-label">
                        Controls.dateRange:Input mask='DD.MM.YY'
                    </div>
                    <Input
                        startValue={firstStartValue}
                        endValue={firstEndValue}
                        customEvents={['onStartValueChanged', 'onEndValueChanged']}
                        onStartValueChanged={handleChangeFirstStartValue}
                        onEndValueChanged={handleChangeFirstEndValue}
                    />
                </div>
                <div>
                    <div className="controls-text-label">
                        Controls.dateRange:Input mask='DD.MM.YYYY'
                    </div>
                    <Input
                        startValue={secondStartValue}
                        endValue={secondEndValue}
                        customEvents={['onStartValueChanged', 'onEndValueChanged']}
                        onStartValueChanged={handleChangeSecondStartValue}
                        onEndValueChanged={handleChangeSecondEndValue}
                        mask="DD.MM.YYYY"
                    />
                </div>
            </div>
        </div>
    );
});

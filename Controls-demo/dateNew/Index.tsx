import { forwardRef, useCallback, useState } from 'react';
import { Input } from 'Controls/date';

export default forwardRef(function DateBaseDemo(_, ref) {
    const date = new Date(2023, 2, 3);

    const [firstDate, setFirstDate] = useState(date);
    const handleChangeFirstDate = useCallback((date: Date) => {
        setFirstDate(date);
    }, []);

    const [secondDate, setSecondDate] = useState(date);
    const handleChangeSecondDate = useCallback((date: Date) => {
        setSecondDate(date);
    }, []);

    const [thirdDate, setThirdDate] = useState(date);
    const handleChangeThirdDate = useCallback((date: Date) => {
        setThirdDate(date);
    }, []);

    return (
        <div ref={ref} className="tw-flex ws-justify-content-center">
            <div>
                <div className="controls-margin_bottom-xl">
                    <div className="controls-text-label">Controls.date:Input mask='DD.MM.YY'</div>
                    <Input
                        value={firstDate}
                        customEvents={['onValueChanged']}
                        onValueChanged={handleChangeFirstDate}
                    />
                </div>
                <div className="controls-margin_bottom-xl">
                    <div className="controls-text-label">Controls.date:Input mask='DD.MM.YYYY'</div>
                    <Input
                        mask="DD.MM.YYYY"
                        value={secondDate}
                        customEvents={['onValueChanged']}
                        onValueChanged={handleChangeSecondDate}
                    />
                </div>
                <div>
                    <div className="controls-text-label">
                        Controls.date:Input calendarButtonVisible=false
                    </div>
                    <Input
                        value={thirdDate}
                        customEvents={['onValueChanged']}
                        onValueChanged={handleChangeThirdDate}
                        calendarButtonVisible={false}
                    />
                </div>
            </div>
        </div>
    );
});

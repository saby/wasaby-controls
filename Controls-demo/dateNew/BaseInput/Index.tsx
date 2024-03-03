import { forwardRef, LegacyRef, useCallback, useState } from 'react';
import { BaseInput } from 'Controls/date';
import 'css!Controls-demo/Input/DateTime/DateTime';

export default forwardRef(function BaseInputDemo(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    const date = new Date(2023, 11, 31, 12, 15, 30);

    const [firstValue, setFirstValue] = useState(date);
    const handleChangeFirstValue = useCallback((event: Event, date: Date) => {
        setFirstValue(date);
    }, []);

    const [secondValue, setSecondValue] = useState(date);
    const handleChangeSecondValue = useCallback((event: Event, date: Date) => {
        setSecondValue(date);
    }, []);

    const [thirdValue, setThirdValue] = useState(date);
    const handleChangeThirdValue = useCallback((event: Event, date: Date) => {
        setThirdValue(date);
    }, []);

    const [fourthValue, setFourthValue] = useState(date);
    const handleChangeFourthValue = useCallback((event: Event, date: Date) => {
        setFourthValue(date);
    }, []);

    const [fifthValue, setFifthValue] = useState(date);
    const handleChangeFifthValue = useCallback((event: Event, date: Date) => {
        setFifthValue(date);
    }, []);

    const [sixthValue, setSixthValue] = useState(date);
    const handleChangeSixthValue = useCallback((event: Event, date: Date) => {
        setSixthValue(date);
    }, []);

    const [seventhValue, setSeventhValue] = useState(date);
    const handleChangeSeventhValue = useCallback((event: Event, date: Date) => {
        setSeventhValue(date);
    }, []);

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div>
                <div className="controlsDemo-Input-DateTime__row">
                    <div className="controls-text-label controlsDemo-Input-DateTime__row-item">
                        mask='DD.MM.YYYY'
                    </div>
                    <div className="controlsDemo-Input-DateTime__row-item">
                        <BaseInput
                            mask="DD.MM.YYYY"
                            value={firstValue}
                            customEvents={['onValueChanged']}
                            onValueChanged={handleChangeFirstValue}
                        />
                    </div>
                </div>
                <div className="controlsDemo-Input-DateTime__row">
                    <div className="controls-text-label controlsDemo-Input-DateTime__row-item">
                        mask='DD.MM.YY'
                    </div>
                    <div className="controlsDemo-Input-DateTime__row-item">
                        <BaseInput
                            mask="DD.MM.YY"
                            value={secondValue}
                            customEvents={['onValueChanged']}
                            onValueChanged={handleChangeSecondValue}
                        />
                    </div>
                </div>
                <div className="controlsDemo-Input-DateTime__row">
                    <div className="controls-text-label controlsDemo-Input-DateTime__row-item">
                        mask='DD.MM'
                    </div>
                    <div className="controlsDemo-Input-DateTime__row-item">
                        <BaseInput
                            mask="DD.MM"
                            value={thirdValue}
                            customEvents={['onValueChanged']}
                            onValueChanged={handleChangeThirdValue}
                        />
                    </div>
                </div>
                <div className="controlsDemo-Input-DateTime__row">
                    <div className="controls-text-label controlsDemo-Input-DateTime__row-item">
                        mask='YYYY'
                    </div>
                    <div className="controlsDemo-Input-DateTime__row-item">
                        <BaseInput
                            mask="YYYY"
                            value={fourthValue}
                            customEvents={['onValueChanged']}
                            onValueChanged={handleChangeFourthValue}
                        />
                    </div>
                </div>
                <div className="controlsDemo-Input-DateTime__row">
                    <div className="controls-text-label controlsDemo-Input-DateTime__row-item">
                        mask='HH:mm'
                    </div>
                    <div className="controlsDemo-Input-DateTime__row-item">
                        <BaseInput
                            mask="HH:mm"
                            value={fifthValue}
                            customEvents={['onValueChanged']}
                            onValueChanged={handleChangeFifthValue}
                        />
                    </div>
                </div>
                <div className="controlsDemo-Input-DateTime__row">
                    <div className="controls-text-label controlsDemo-Input-DateTime__row-item">
                        mask='HH:mm:ss'
                    </div>
                    <div className="controlsDemo-Input-DateTime__row-item">
                        <BaseInput
                            mask="HH:mm:ss"
                            value={sixthValue}
                            customEvents={['onValueChanged']}
                            onValueChanged={handleChangeSixthValue}
                        />
                    </div>
                </div>
                <div className="controlsDemo-Input-DateTime__row">
                    <div className="controls-text-label controlsDemo-Input-DateTime__row-item">
                        mask='DD.MM.YYYY HH:mm:ss'
                    </div>
                    <div className="controlsDemo-Input-DateTime__row-item">
                        <BaseInput
                            mask="DD.MM.YYYY HH:mm:ss"
                            value={seventhValue}
                            customEvents={['onValueChanged']}
                            onValueChanged={handleChangeSeventhValue}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

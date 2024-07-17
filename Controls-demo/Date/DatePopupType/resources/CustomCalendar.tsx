import { forwardRef, useContext } from 'react';
import { Button } from 'Controls/buttons';
import { period as dateRangeFormatter } from 'Types/formatter';
import { Context } from 'Controls/popup';
import { Sticky } from 'Controls/popupTemplate';
import 'css!Controls-demo/Date/DatePopupType/resources/CustomCalendar';

const FIRST_PERIOD = [new Date(2020, 0, 5), new Date(2020, 0, 8)];
const SECOND_PERIOD = [new Date(2021, 0, 1), new Date(2022, 0, 0)];
const EMPTY_PERIOD = [null, null];

function Test(props, ref) {
    const popupContext = useContext(Context);
    const selectPeriod = (period: Date[] | null[]) => {
        popupContext.sendResult(...period);
        popupContext.close();
    };
    return (
        <Sticky
            ref={ref}
            closeButtonViewMode="external"
            shadowVisible={true}
            bodyContentTemplate={() => {
                return (
                    <div className="controlsDemo-CustomCalendar">
                        Выбранный период: {dateRangeFormatter(props.startValue, props.endValue)}
                        <Button
                            caption="Выбрать 2020.01.05-2020.01.08"
                            onClick={() => {
                                selectPeriod(FIRST_PERIOD);
                            }}
                        />
                        <Button
                            caption="Выбрать 2021.01.01-2021.12.31"
                            onClick={() => {
                                selectPeriod(SECOND_PERIOD);
                            }}
                        />
                        <Button
                            caption="Сбросить период"
                            onClick={() => {
                                selectPeriod(EMPTY_PERIOD);
                            }}
                        />
                    </div>
                );
            }}
        />
    );
}

export default forwardRef(Test);

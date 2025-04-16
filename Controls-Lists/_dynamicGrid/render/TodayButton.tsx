/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as rk from 'i18n!Controls';
import * as React from 'react';

interface ITodayButtonProps {
    currentDate: Date;
    onClick: (e: MouseEvent) => void;
    dataQa?: string;
}

const WRAPPER_CLASS_NAME = 'tw-flex tw-items-baseline tw-justify-center';
const BUTTON_CLASS_NAME =
    'ControlsLists-dynamicGrid__TodayButton controls-text-secondary controls-fontsize-l tw-cursor-pointer';
function TodayButton(props: ITodayButtonProps) {
    const { currentDate, onClick, dataQa = 'today-button' } = props;
    return (
        <div className={WRAPPER_CLASS_NAME}>
            <div
                className={BUTTON_CLASS_NAME}
                data-qa={dataQa}
                onClick={onClick}
                title={rk('Текущий период')}
            >
                {currentDate}
            </div>
        </div>
    );
}

const TodayButtonMemo = React.memo(TodayButton);

export { TodayButtonMemo, ITodayButtonProps };

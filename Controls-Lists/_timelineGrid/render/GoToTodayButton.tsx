import * as rk from 'i18n!Controls';
import { Base as BaseDateUtils } from 'Controls/dateUtils';

import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridFactory';
import { getQuantum, getRangeSize, Quantum, shiftDate } from 'Controls-Lists/_timelineGrid/utils';
import { START_DAY_HOUR } from 'Controls-Lists/_timelineGrid/constants';

interface IProps {
    range: IRange;
    setRange: (range: IRange) => void;
}

function getTodayRange(currentRange: IRange): IRange {
    const quantum = getQuantum(currentRange);
    const rangeSize = getRangeSize(currentRange, quantum);

    let startDate = BaseDateUtils.normalizeDate(new Date());
    if (quantum === Quantum.Hour) {
        startDate.setHours(START_DAY_HOUR);
    }
    if (quantum === Quantum.Month) {
        startDate = BaseDateUtils.getStartOfMonth(startDate);
    }

    let endDate = new Date(startDate);
    shiftDate(endDate, 'forward', quantum, rangeSize - 1);
    if (quantum === Quantum.Month) {
        endDate = BaseDateUtils.getEndOfMonth(endDate);
    }

    return {
        start: startDate,
        end: endDate,
    };
}

export default function GoToTodayButton(props: IProps) {
    const { range, setRange } = props;
    const onClick = () => {
        const newRange = getTodayRange(range);
        setRange(newRange);
    };

    const currentDate = new Date().getDate();

    return (
        <div
            className={
                'ControlsLists-timelineGrid__GoToTodayButton controls-text-secondary controls-fontsize-l tw-cursor-pointer'
            }
            onClick={onClick}
            title={rk('Текущий период')}
        >
            {currentDate}
        </div>
    );
}

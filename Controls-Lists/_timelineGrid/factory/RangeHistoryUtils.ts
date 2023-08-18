import { USER } from 'ParametersWebAPI/Scope';

import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridFactory';
import { DAY_IN_MS } from 'Controls-Lists/_timelineGrid/constants';
import { getTodayRange } from 'Controls-Lists/_timelineGrid/render/GoToTodayButton';

interface IRangeData {
    range: IRange;
}

interface ISavedRangeData extends IRangeData {
    saveTime: Date;
}

function getErrorResult(): ISavedRangeData {
    return {
        range: null,
        saveTime: null,
    };
}

function parseSavedRangeData(json: string): ISavedRangeData {
    if (!json) {
        return getErrorResult();
    }

    const { saveTime, range } = JSON.parse(json) as ISavedRangeData;
    const start = new Date(range.start);
    const end = new Date(range.end);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return getErrorResult();
    }

    return {
        range: {
            start,
            end,
        },
        saveTime: new Date(saveTime),
    };
}

export const RangeHistoryUtils = {
    store(key: string, range: IRange) {
        if (!key) {
            return Promise.resolve(false);
        }
        const rangeDataToSave: ISavedRangeData = {
            range,
            saveTime: new Date(),
        };
        const rangeDataJson = JSON.stringify(rangeDataToSave);
        return USER.set(key, rangeDataJson);
    },
    restore(key: string): Promise<IRange> {
        if (!key) {
            return Promise.resolve(null);
        }
        return USER.load([key]).then((config) => {
            const { range, saveTime } = parseSavedRangeData(config.get(key));
            if (!range) {
                return null;
            }

            const currentDate = new Date();
            const savedDateIsInvalid = isNaN(saveTime.getTime());
            const dayIsExpired =
                savedDateIsInvalid || currentDate.getTime() - saveTime.getTime() > DAY_IN_MS;
            if (dayIsExpired) {
                // Если истекли сутки с прошлого сохранения диапазона, то мы должны поставить аналогичный диапазон,
                // только от текущей даты
                return getTodayRange(range);
            }

            return range;
        });
    },
};

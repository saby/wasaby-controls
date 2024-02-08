import { USER } from 'ParametersWebAPI/Scope';

import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import { DAY_IN_MS } from 'Controls-Lists/_timelineGrid/constants';
import { getTodayRange } from 'Controls-Lists/_timelineGrid/render/GoToTodayButton';
import { IQuantum } from 'Controls-Lists/_timelineGrid/utils';

export type TQuantumScaleMap = { [p: string]: number };

interface IRangeData {
    range: IRange;
    quantumScaleMap?: TQuantumScaleMap;
}

interface ISavedRangeData extends IRangeData {
    saveTime: Date;
}

function getNullObj(): IRangeData {
    return {
        range: null,
        quantumScaleMap: null,
    };
}

function getErrorResult(): ISavedRangeData {
    return {
        ...getNullObj(),
        saveTime: null,
    };
}

function parseSavedRangeData(json: string): ISavedRangeData {
    if (!json) {
        return getErrorResult();
    }

    const { saveTime, range, quantumScaleMap } = JSON.parse(json) as ISavedRangeData;
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
        quantumScaleMap,
    };
}

function isRangeValid(range: IRange): boolean {
    if (range && range.start && range.end) {
        if (range.end.getTime() - range.start.getTime() > 0) {
            return true;
        }
    }
    return false;
}

export const RangeHistoryUtils = {
    store(key: string, range: IRange, quantumScaleMap?: TQuantumScaleMap) {
        if (!key) {
            return Promise.resolve(false);
        }
        const rangeDataToSave: ISavedRangeData = {
            range,
            saveTime: new Date(),
            quantumScaleMap,
        };
        const rangeDataJson = JSON.stringify(rangeDataToSave);
        return USER.set(key, rangeDataJson);
    },
    // TODO Временно, пока прикладников не поменяем
    restoreAll(
        key: string,
        quantums?: IQuantum[]
    ): Promise<{ range?: IRange; quantumScaleMap?: TQuantumScaleMap }> {
        if (!key) {
            return Promise.resolve(getNullObj());
        }
        return USER.load([key]).then((config) => {
            const { range, quantumScaleMap, saveTime } = parseSavedRangeData(config.get(key));
            if (!range) {
                return getNullObj();
            }

            const currentDate = new Date();
            const savedDateIsInvalid = isNaN(saveTime.getTime());
            const savedRangeValid = isRangeValid(range);
            const dayIsExpired =
                savedDateIsInvalid || currentDate.getTime() - saveTime.getTime() > DAY_IN_MS;
            if (!savedRangeValid) {
                // Если был сохранен невалидный range, то работаем, как в первый раз.
                return getNullObj();
            }
            const result = {
                range,
                quantumScaleMap,
            };
            if (dayIsExpired) {
                // Если истекли сутки с прошлого сохранения диапазона, то мы должны поставить аналогичный диапазон,
                // только от текущей даты
                result.range = getTodayRange(range, quantums);
            }
            return result;
        });
    },
    restore(key: string): Promise<IRange> {
        return this.restoreAll(key).then((result) => result.range);
    },
};

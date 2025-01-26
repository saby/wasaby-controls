/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { USER } from 'ParametersWebAPI/Scope';

import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import { DAY_IN_MS } from 'Controls-Lists/_timelineGrid/constants';
import { getTodayRange } from 'Controls-Lists/_timelineGrid/render/GoToTodayButton';
import { IQuantum, Quantum } from 'Controls-Lists/_timelineGrid/utils';

/**
 * Тип сохраненных масштабов для каждого кванта
 */
export type TQuantsReplacementMap = Partial<Record<Quantum, Quantum>>;

interface IRangeData {
    /**
     * Диапазон времени
     */
    range: IRange | null;
    /**
     * Выбранный масштаб для каждого кванта
     */
    quantsReplacementMap?: TQuantsReplacementMap | null;
    /**
     * Флаг, определяющий нужен ли подскролл к началу периода при востановлении диапазона
     */
    needScroll?: boolean;
}

/**
 * Сохраняемые в истории данные о диапазонах
 */
interface ISavedRangeData extends IRangeData {
    /**
     * Время последнего сохранения данных в истории
     */
    saveTime: Date | null;
}

/**
 * Возвращает объект для пустого состояния истории
 */
function getNullObj(): IRangeData {
    return {
        range: null,
        quantsReplacementMap: null,
    };
}

/**
 * Возвращает пустое состояние истории в случае ошибки
 */
function getErrorResult(): ISavedRangeData {
    return {
        ...getNullObj(),
        saveTime: null,
    };
}

/**
 * Разбор данных из истории.
 * @param json - json-представление данных.
 */
function parseSavedRangeData(json: string): ISavedRangeData {
    if (!json) {
        return getErrorResult();
    }

    const { saveTime, range, quantsReplacementMap } = JSON.parse(json) as ISavedRangeData;
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
        quantsReplacementMap,
    };
}

/**
 * Проверка валидности сохраненного диапазона.
 * Дата начала должна быть раньше даты конца диапазона.
 * Диапазон должен быть год или меньше.
 * @param range
 */
function isRangeValid(range: IRange): boolean {
    if (range && range.start && range.end) {
        if (range.end.getTime() - range.start.getTime() <= 0) {
            return false;
        }
        const maxDays = 366;
        // Период больше года - невалидный.
        return range.end.getTime() - range.start.getTime() <= maxDays * DAY_IN_MS;
    }
    return false;
}

/**
 * Утилиты для работы с историей выбора периода.
 * Используются в фабрике данных.
 * @class Controls-Lists/_timelineGrid/factory/RangeHistoryUtils
 * @public
 */
export const RangeHistoryUtils = {
    /**
     * Запись данных в историю.
     * @param key - идентификатор хранилища
     * @param range - сохраняемый диапазон
     * @param quantsReplacementMap - сохраняемые подмены квантов
     * @param needScroll - флаг, определяющий нужен ли подскролл ук началу периода при востановлении диапазона
     */
    store(
        key: string,
        range: IRange,
        quantsReplacementMap?: TQuantsReplacementMap,
        needScroll?: boolean
    ) {
        if (!key) {
            return Promise.resolve(false);
        }
        const rangeDataToSave: ISavedRangeData = {
            range,
            saveTime: new Date(),
            quantsReplacementMap,
            // TODO Убрать needScroll из range https://online.sbis.ru/opendoc.html?guid=4201154a-ce23-49a2-ba2b-9966ea7cf19d&client=3
            needScroll: needScroll || range.needScroll,
        };
        const rangeDataJson = JSON.stringify(rangeDataToSave);
        return USER.set(key, rangeDataJson);
    },
    // TODO Временно, пока прикладников не поменяем
    /**
     * Чтение диапазона и масштабов из истории.
     * @param key - идентификатор хранилища
     * @param quantums - конфигурация квантов
     */
    restoreAll(key: string, quantums?: IQuantum[]): Promise<IRangeData> {
        if (!key) {
            return Promise.resolve(getNullObj());
        }
        return USER.load([key]).then((config) => {
            const { range, quantsReplacementMap, saveTime, needScroll } = parseSavedRangeData(
                config.get(key)
            );
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
            const result: IRangeData = {
                range,
                quantsReplacementMap,
                // TODO Убрать needScroll из range https://online.sbis.ru/opendoc.html?guid=4201154a-ce23-49a2-ba2b-9966ea7cf19d&client=3
                needScroll: needScroll || range.needScroll,
            };
            if (dayIsExpired) {
                // Если истекли сутки с прошлого сохранения диапазона, то мы должны поставить аналогичный диапазон,
                // только от текущей даты
                result.range = getTodayRange(range, quantums);
            }
            return result;
        });
    },
    /**
     * Чтение диапазона из истории.
     * @param key - идентификатор хранилища
     */
    restore(key: string): Promise<IRange> {
        return this.restoreAll(key).then((result) => result.range);
    },
};

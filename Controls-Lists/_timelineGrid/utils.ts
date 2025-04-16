/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { Base as BaseDateUtils, Range as RangeUtils } from 'Controls/dateUtils';
import { TNavigationDirection } from 'Controls/interface';
import { Logger } from 'UICommon/Utils';
import { RecordSet } from 'Types/collection';

import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import {
    END_DAY_HOUR,
    START_DAY_HOUR,
    DAYS_IN_TWO_MONTHS,
    HOURS_IN_DAY,
    MONTHS_IN_YEAR,
    DAYS_IN_MONTH,
    DIFF_UTC_MSK,
    DAYS_IN_WEEK,
    MINUTES_IN_HALF_HOUR,
    MINUTES_IN_QUARTER_HOUR,
    MONTHS_IN_QUARTER,
    MONTHS_IN_HALFYEAR,
    YEARS_BY_DEFAULT,
    HALF,
    QUARTER,
    WEEKS_IN_QUARTER,
    DAY_IN_MS,
} from 'Controls-Lists/_timelineGrid/constants';
import { constants } from 'Env/Env';
import { DateTime } from 'Types/entity';
import { IDynamicColumnConfig } from 'Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent';
import TimelineGridSlice from 'Controls-Lists/_timelineGrid/factory/Slice';
import {
    CHECKBOX_COLUMN_WIDTH,
    DEFAULT_MIN_DYNAMIC_COLUMN_WIDTH,
} from 'Controls-Lists/dynamicGrid';
import { TQuantsReplacementMap } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';

/**
 * Варианты значений для насыщенности событий
 * @typedef {String} Controls-Lists/timelineGrid/TEventSaturation
 * @variant max Максимальная насыщенность
 * @variant mid Средняя насыщенность
 * @variant min Минимальная насыщенность
 */
export type TEventSaturation = 'max' | 'mid' | 'min';

/**
 * Варианты значений кванта динамических данных в "Таймлайн таблице".
 * Квант - это деление времени в рамках одного временного периода. По квантам строятся динамические колонки таймлайн-таблице.
 * Например, в периоде "День" всего 24 часа, а квантами могут быть или "Час", или "30 Минут", или "15 минут". Это значит, что каждая динамическая колонка отражает, соответственно, временной отрезок "Час", "30 Минут" или "15 минут".
 * @typedef Quantum
 * @variant second В колонках отображаются секунды
 * @variant minute В колонках отображаются минуты
 * @variant quarterHour В колонках отображается по 15 минут
 * @variant halfHour В колонках отображается по 30 минут
 * @variant hour В колонках отображаются часы
 * @variant day В колонках отображаются дни
 * @variant week В колонках отображаются недели (период месяц, квартал, неделя - одна колонка)
 * @variant month В колонках отображаются месяцы
 * @variant quarter В колонках отображаются квартал (период год, период квартал)
 * @variant halfYear В колонках отображаются полугодие (период год, период полугодие)
 * @variant year В колонках отображаются года (период год, 12 лет)
 */
export enum Quantum {
    Second = 'second',
    Minute = 'minute',
    QuarterHour = 'quarterHour',
    HalfHour = 'halfHour',
    Hour = 'hour',
    Day = 'day',
    Week = 'week',
    Month = 'month',
    Quarter = 'quarter',
    HalfYear = 'halfYear',
    Year = 'year',
}

/**
 * Возвращает следующий квант по напралению scaleDirection
 * @param quantum
 * @param quantums
 * @param scaleDirection
 */
export function getNextQuantum(
    quantum: Quantum,
    quantums: IQuantum[],
    scaleDirection: TScaleDirection
): Quantum | undefined {
    const allQuantumsStack = Object.values(Quantum).reverse();
    const availableQuantums = allQuantumsStack.filter((q1) => {
        return (
            quantums.findIndex((q2) => {
                return q2.name === q1;
            }) !== -1
        );
    });
    const quantumIndex = availableQuantums.indexOf(quantum);
    if (quantumIndex === -1) {
        return;
    }
    return availableQuantums[quantumIndex + (scaleDirection === 'increase' ? 1 : -1)] as Quantum;
}

/**
 * Доступные диапазоны по умолчанию, если переданы кванты без scales
 * @param quantum
 */
function getDefaultScaleValues(quantum: Quantum): IScale[] {
    switch (quantum) {
        case Quantum.Week:
        case Quantum.Day:
            return [{ value: DayRange.Month }];
        case Quantum.Month:
        case Quantum.Quarter:
        case Quantum.HalfYear:
            return [{ value: MonthRange.Year }];
        default:
            return [];
    }
}

/**
 * Возвращает массив доступных вариантов периода, в котором отображается квант.
 * Значения автоматически сортируются в порядке убывания для корректности работы кнопок зума
 * @param quantum
 * @param quantums Конфигурация для квантов.
 */
export function extractQuantumScaleValues(quantum: Quantum, quantums?: IQuantum[]): IScale[] {
    const extractedQuantum = extractQuantum(quantum, quantums);
    return extractedQuantum?.scales
        ? extractedQuantum.scales.slice().sort((a, b) => {
              return b.value - a.value;
          })
        : getDefaultScaleValues(quantum);
}

export function extractQuantum(quantum: Quantum, quantums?: IQuantum[]): IQuantum | null {
    const index = quantums?.findIndex((q) => {
        return q.name === quantum;
    });
    if (index === undefined || index === -1) {
        return null;
    }
    return quantums[index];
}

/**
 * Значения пресетов периодов для кванта "День".
 * @typedef {String} Controls-Lists/timelineGrid/DayRange
 * @variant 30 - разместить на вьюпорте дни на 1 месяц. Не обязательно в месяце 30 дней ,может быть и 28. 30 - это просто значение.
 * @variant 7 - разместить на вьюпорте дни на 1 неделю
 */
export enum DayRange {
    Month = 30,
    Week = 7,
}

/**
 * Значения пресетов периодов для кванта "Месяц".
 * @typedef {String} Controls-Lists/timelineGrid/MonthRange
 * @variant 12 - разместить на вьюпорте дни на 1 год
 * @variant 6 - разместить на вьюпорте дни на 6 мес
 * @variant 3 - разместить на вьюпорте дни на 3 мес
 */
export enum MonthRange {
    Year = 12,
    HalfYear = 6,
    Quarter = 3,
}

/**
 * Доступность при переключении режимов
 * @typedef TQuantumRangeAccessibility
 * @variant header - Доступность при переключении режимов кликом по заголовку.
 * @variant zoom - Доступность при переключении режимов кнопками изменения масштаба.
 * @variant all - Доступность при любом способе переключении режимов (по умолчанию)
 */
export type TQuantumRangeAccessibility = 'all' | 'header' | 'zoom';

/**
 * Пресет периода
 * @public
 */
export interface IScale {
    /**
     * Значение пресета. Задаётся из enum {Controls/timelineGrid:DayRange} или {Controls/timelineGrid:MonthRange}
     */
    value: DayRange | MonthRange | number;

    /**
     * Доступность при переключении режимов:
     * * rangeSelector - кликом по заголовку и в компоненте выбора периода.
     * * zoom - кнопками изменения масштаба.
     * @default all
     */
    accessibility?: TQuantumRangeAccessibility;
}

export interface ICustomRange {
    start: number;
    end: number;
}

/**
 * Квант - это деление времени в рамках одного временного периода. По квантам строятся динамические колонки таймлайн-таблице.
 * Например, в периоде "День" всего 24 часа, а квантами могут быть "Час", "30 Минут", "15 минут". Это значит, что каждая динамическая колонка - это, соответственно, "Час", "30 Минут" или "15 минут".
 * @interface Controls-Lists/_timelineGrid/utils/IQuantum
 * @public
 * @demo Controls-Lists-demo/timelineGrid/WI/Scale/Index
 * @see https://n.sbis.ru/article/19a7fea9-d700-4bf4-9193-5e739cca9fe9?a#toc_0c675c10-beb8-48a1-981b-e88d508f2d75 Настройка доступных квантов и масштабирования
 */
export interface IQuantum {
    /**
     * Название кванта, см подробнее {@link Controls-Lists/timelineGrid:Quantum Quantum (enum)}
     */
    name: Quantum;
    /**
     * Доступные пресеты периодов сетки в рамках кванта.
     * Каждому кванту соответствует набор доступных для отображения периодов.
     * Например, квант "Месяц" может быть отображён в периодах "Год", "Полугодие", "Квартал", а квант "День" в периодах "Неделя", "Месяц".
     * При помощи данной настройки можно указать, какие именно предустановленные периоды будут включаться при нажантии кнопок масштабироавния или клике в шапку таблицы.
     * Чтобы сделвть период доступным при нажатии на кнопки масштабирования, укажите в accessibility значение zoom
     * Чтобы сделвть период доступным при нажатии на шапку таблицы, укажите в accessibility значение header
     * Чтобы сделвть период доступным при нажатии и на кнопки масштабирования и на шапку таблицы, укажите в accessibility значение all
     * @see Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments#rangeHistoryId
     * @example
     * <pre brush>
     *     {
     *         name: Quantum.Month,
     *         scales: [
     *             {
     *                 value: MonthRange.Year,
     *                 accessibility: 'zoom' // Доступно и при переходе через +/- и черпез компонент выбора периода и через клик по заголовку.
     *             },
     *             {
     *                 value: MonthRange.HalfYear,
     *                 accessibility: 'zoom'  // Доступно только при переходе через +/-
     *             },
     *             {
     *                 value: MonthRange.Quarter,
     *                 accessibility: 'zoom' // Доступно только при переходе через +/-
     *             }
     *         ],
     *     },
     * </pre>
     */
    scales?: IScale[];
    /**
     * Если выставлено в true, то при переключении к квантам одного периода, этот квант будет выбран по умолчанию.
     * Например, переключаемся в режим дня, но показать по умолчанию надо кванты по 30 минут.
     * В рамках периода "День" доступны кванты hour, halfHour, quarterHour - Это кванты одного периода.
     * Можно выбрать среди них квант, который будет выбран по умолчанию при инициализации Таймлайн-таблицы.
     * Этот квант может быть изменён при помощи кнопок изменения масштаба, после чего он запоминается,
     * и при последующих переключениях уже используется последнее выбранное клиентом ззначение.
     * @default false
     * @see Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments#rangeHistoryId
     * @example
     * При конфигурации, приведённой ниже часы по умолчанию бьются по 30 МИНУТ.
     * <pre brush>
     *     {
     *         name: Quantum.Hours,
     *     },
     *     {
     *         name: Quantum.HalfHour,
     *         default: true
     *     },
     *     {
     *         name: Quantum.QuarterHour,
     *     },
     * </pre>
     */
    default?: boolean;
    /**
     * Коллбек, позволяющий скорректировать период на основе загруженных данных.
     * Используется для подскролла к началу периода (например, к началу рабочей смены при переходе в режим дня).
     * В качестве аргументов принимает:
     * * items {@link Types/collection:RecordSet} - загруженные записи
     * * range {@link Controls-Lists/timelineGrid:IRange} - текущий период
     * @example
     * <pre brush>
     * function loadedRangeAdjustmentCallback(items: RecordSet, range: IRange): IRange {
     *     const newRange = {
     *          start: customCalcStart(range, items),
     *          end: customCalcEnd(range, items),
     *      };
     *      return newRange;
     * }
     *
     * const quants: IQuantum[] = [
     *     {
     *         name: Quantum.QuarterHour, // день, по 15 минут
     *         loadedRangeAdjustmentCallback,
     *     },
     *     {
     *         name: Quantum.HalfHour, // день, по 30 минут
     *         loadedRangeAdjustmentCallback,
     *         default: true,
     *     },
     *     {
     *         name: Quantum.Hour, // день, по 1 часу
     *         loadedRangeAdjustmentCallback,
     *     },
     * ]
     * </pre>
     */
    loadedRangeAdjustmentCallback?: (items: RecordSet, range: IRange) => IRange;
    /**
     * Пользовательское разбиение на колонки. Доступно только для кванта "часы"
     * @see Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments#rangeHistoryId
     * @example
     * <pre brush>
     *     {
     *         name: Quantum.Hours
     *         customRanges: [
     *             {
     *                 start: 8,
     *                 end: 12
     *             },
     *             {
     *                 start: 14,
     *                 end: 16
     *             },
     *             {
     *                 start: 19,
     *                 end: 21
     *             }
     *         ]
     *     }
     * </pre>
     */
    customRanges?: ICustomRange[];
}

/**
 * Тип для конфигурации минимальных ширин колонок в соответствие квантам времени.
 * В качестве ключей принимает строковые названия размера квантов из {@link Controls-Lists/timelineGrid:Quantum}
 * Строковые значения задаются в пикселях.
 * @example
 * <pre class="brush: js">
 *     const dynamicColumnMinWidths = {
 *         day: '35px',
 *         month: '35px',
 *         hour: '100px',
 *     };
 *
 *    return <TimelineGridConnectedComponent storeId="EmployeeList"
 *                                           viewportWidth={workspaceWidth}
 *                                           dynamicColumnMinWidths={dynamicColumnMinWidths}>;
 * </pre>
 * @typedef {Record<Controls-Lists/timelineGrid:Quantum, string>} Controls-Lists/_timelineGrid/utils/TDynamicColumnMinWidths
 */
export type TDynamicColumnMinWidths = Record<Quantum, string>;

/**
 * Варианты направления масштабирования.
 * @typedef {String} Controls-Lists/_timelineGrid/utils/TScaleDirection
 * @variant increase Более детальное отображение
 * @variant decrease Менее детальное отображение
 */
export type TScaleDirection = 'increase' | 'decrease';

/**
 * Возвращает квант таймлайна по переданному временному периоду.
 * @param {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} range Отображаемый на таймлайне временной период
 * @param quantsReplacementMap Карта подмены квантов (Объект {Quantum.Hour:Quantum.Hour|Quantum.HalfHour|Quantum.QuarterHour})
 * @returns {Controls-Lists/timelineGrid:Quantum}
 */
export function getQuantum(range: IRange, quantsReplacementMap?: TQuantsReplacementMap): Quantum {
    let start = range.start;
    let end = range.end;
    if (constants.isServerSide) {
        start = correctDateFromClientToServer(start);
        end = correctDateFromClientToServer(end);
    }
    let rangeSize = BaseDateUtils.getHoursByRange(start, end);
    // Должно быть строгое сравнение, т.к. если выбрать 2 дня, то будет 24 часа, но квант должен быть день.
    // 24 часа, т.к. в датах время 00:00 всегда.
    if (rangeSize < HOURS_IN_DAY) {
        if (quantsReplacementMap?.[Quantum.Hour]) {
            return quantsReplacementMap[Quantum.Hour];
        }
        return Quantum.Hour;
    }

    rangeSize = BaseDateUtils.getDaysByRange(start, end);
    if (rangeSize <= DAYS_IN_TWO_MONTHS) {
        if (quantsReplacementMap?.[Quantum.Day]) {
            return quantsReplacementMap[Quantum.Day];
        }
        return Quantum.Day;
    }

    rangeSize = BaseDateUtils.getAmountOfMonths(start, end);

    if (rangeSize <= MONTHS_IN_YEAR) {
        if (quantsReplacementMap?.[Quantum.Month]) {
            return quantsReplacementMap[Quantum.Month];
        }
        return Quantum.Month;
    }

    return Quantum.Year;
}

/**
 * Возвращает длину периода в часах.
 * @param {Date} startValue Начало периода
 * @param {Date} endValue Конец периода
 */
export function getPeriodLengthInHours(startValue: Date, endValue: Date): number {
    const oneHour = 60 * 60 * 1000;
    return Math.ceil(Math.abs((startValue.getTime() - endValue.getTime()) / oneHour)) + 1;
}

/**
 * Возвращает длину периода в минутах.
 * @param {Date} startValue Начало периода
 * @param {Date} endValue Конец периода
 */
export function getPeriodLengthInMinutes(startValue: Date, endValue: Date): number {
    const oneMinute = 60 * 1000;
    return Math.ceil(Math.abs((startValue.getTime() - endValue.getTime()) / oneMinute)) + 1;
}

/**
 * Возвращает длину периода в секундах.
 * @param {Date} startValue Начало периода
 * @param {Date} endValue Конец периода
 */
export function getPeriodLengthInSeconds(startValue: Date, endValue: Date): number {
    const oneSecond = 1000;
    return Math.ceil(Math.abs((startValue.getTime() - endValue.getTime()) / oneSecond)) + 1;
}

/**
 * Возвращает размер периода (число колонок) по переданному дмапазону и кванту таймлайна.
 * В зависимости от кванта меняется единица измерения размера периода.
 * @param {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} range Отображаемый на таймлайне временной период
 * @param quantum {Controls-Lists/timelineGrid:Quantum}
 */
export function getRangeSize(
    range: IRange,
    quantum: Quantum,
    customRanges?: ICustomRange[]
): number {
    if (customRanges && quantum === 'hour') {
        return customRanges.length;
    }
    let start = range.start;
    let end = range.end;
    if (constants.isServerSide) {
        start = correctDateFromClientToServer(start);
        end = correctDateFromClientToServer(end);
    }
    switch (quantum) {
        case Quantum.Minute:
        // todo
        case Quantum.Second:
        // todo
        case Quantum.HalfHour:
        case Quantum.QuarterHour:
            return HOURS_IN_DAY;
        case Quantum.Hour:
            return getPeriodLengthInHours(start, end);
        case Quantum.Day:
            return RangeUtils.getPeriodLengthInDays(start, end);
        case Quantum.Week:
            return Math.floor(RangeUtils.getPeriodLengthInDays(start, end) / DAYS_IN_WEEK);
        case Quantum.Month:
            return RangeUtils.getPeriodLengthInMonths(start, end);
        case Quantum.Quarter:
            return QUARTER;
        case Quantum.HalfYear:
            return HALF;
        case Quantum.Year:
            return YEARS_BY_DEFAULT;
    }
}

/**
 * Возвращает true, если переданный квант меньше 1 дня
 * @param quantum
 */
export function isQuantumLessThanDay(quantum: Quantum): boolean {
    return [
        Quantum.Hour,
        Quantum.HalfHour,
        Quantum.QuarterHour,
        Quantum.Minute,
        Quantum.Second,
    ].includes(quantum);
}

/**
 * Группы квантов в рамках одного периода
 */
export function getQuantsGroups(): Quantum[][] {
    return [
        // Период = День, доступны Часы, получасия, 15минутия
        [Quantum.Hour, Quantum.HalfHour, Quantum.QuarterHour],
        // Период = Неделя, Месяц, доступны дни и недели
        [Quantum.Day, Quantum.Week],
        // Кванты Месяц, Квартал, Полугодие, Год доступны в периоде "Год"
        [Quantum.Month, Quantum.Quarter, Quantum.HalfYear, Quantum.Year],
    ];
}

/**
 * Возвращает true, если кванты в одной группе периодов
 * @param q1
 * @param q2
 */
export function areQuantsInSameRangeGroup(q1: Quantum, q2: Quantum): boolean {
    const groups = getQuantsGroups();
    const group = groups.find((group) => group.includes(q1));
    return !!group?.includes(q2);
}

/*
 * Функция для коректировки даты при уменьшении масштаба.
 * @param date
 * @param quantum
 */
export function resetDateToStart(date: Date, quantum?: Quantum): Date {
    if (quantum === Quantum.Second || quantum === Quantum.Minute) {
        date.setSeconds(0, 0);
    } else if (
        quantum === Quantum.Hour ||
        quantum === Quantum.QuarterHour ||
        quantum === Quantum.HalfHour
    ) {
        date.setMinutes(0, 0, 0);
    } else if (quantum === Quantum.Day || quantum === Quantum.Week) {
        date.setHours(0, 0, 0, 0);
    } else if (
        quantum === Quantum.Month ||
        quantum === Quantum.Quarter ||
        quantum === Quantum.HalfYear ||
        quantum === Quantum.Year
    ) {
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
    }
    return date;
}

// New Calculation

/**
 * Возвращает доступность перехода к выбранному периодУ.
 * К периоду можно перейти, если
 * * Для указанного кванта настроены предустановленные периоды И
 * * Среди предустановленных периодов найден тот, к которому мы хотим перейти
 * * Указанный accessibility совпадает с настроенной для периода областью доступности или настроено all.
 * @param quantum
 * @param quantums
 * @param scale
 * @param accessibility
 */
export function isRangeAvailable(
    quantum: Quantum,
    quantums: IQuantum[],
    scale: DayRange | MonthRange | number,
    accessibility: TQuantumRangeAccessibility = 'all'
): boolean {
    const availablePresets = extractQuantumScaleValues(quantum, quantums);
    return !!availablePresets?.some((found) => {
        return (
            found.value === scale &&
            (!found.accessibility ||
                found.accessibility === accessibility ||
                found.accessibility === 'all')
        );
    });
}

/**
 * Возвращает карту пресетов периодов для квантов месяц и день.
 * @param quantum Квант, для которого нужно вернуть пресеты.
 * @param targetDate дата, относительно которой будет считаться период
 */
export function getRangePresets(
    quantum: Quantum,
    targetDate: Date
): Record<MonthRange | DayRange | number, IRange> | undefined {
    let presets: Record<string, IRange> | undefined;
    if (quantum === Quantum.Month) {
        // Доступные пресеты для кванта месяц - 12 мес, 6, и 3 мес
        presets = {
            [MonthRange.Year]: {
                start: BaseDateUtils.getStartOfYear(targetDate),
                end: BaseDateUtils.getEndOfYear(targetDate),
            },
            [MonthRange.HalfYear]: {
                start: BaseDateUtils.getStartOfHalfyear(targetDate),
                end: BaseDateUtils.getEndOfHalfyear(targetDate),
            },
            [MonthRange.Quarter]: {
                start: BaseDateUtils.getStartOfQuarter(targetDate),
                end: BaseDateUtils.getEndOfQuarter(targetDate),
            },
        };
    } else if (quantum === Quantum.Day) {
        // Доступные пресеты для кванта День - 30дн, 7дн
        presets = {
            [DayRange.Month]: {
                start: BaseDateUtils.getStartOfMonth(targetDate),
                end: BaseDateUtils.getEndOfMonth(targetDate),
            },
            [DayRange.Week]: {
                start: BaseDateUtils.getStartOfWeek(targetDate),
                end: BaseDateUtils.getEndOfWeek(targetDate),
            },
        };
    }
    return presets;
}

interface IGetNextRangePresetParams {
    quantum: Quantum;
    quantums: IQuantum[];
    currentRange: IRange;
    targetDate: Date;
    scaleDirection: TScaleDirection;
    accessibility: TQuantumRangeAccessibility;
    availableRanges?: Record<string, number[]>;
}

/**
 * Возвращает следующий пресет периодов в указанном направлении изменения масштаба.
 * Всегда возвращает даты относительно указанной targetDate.
 * @param quantum Текущий квант
 * @param quantums Настрйка квантов
 * @param currentRange Текущий период, используется для сравнения с периодом из пресета
 * @param targetDate Дата, относительно которой будет считаться период
 * @param scaleDirection Направление масштабирования сетки Таймлайн-таблицы
 * @param accessibility {String} Доступность масштабов для переключения. (zoom - для кнопок масштабирования или header - для кликов по звголовку)
 * @param availableRanges {Record<string, number[]>} Доступные диапазоны, расчитанные на основе ширины вьюпорта и ширины ячеек.
 */
export function getNextRangePreset({
    quantum,
    quantums,
    currentRange,
    targetDate,
    scaleDirection,
    accessibility,
    availableRanges,
}: IGetNextRangePresetParams): IRange | undefined {
    // Максимальная длина диапазона на вьюпорте.
    const maxRangeSize =
        availableRanges?.[quantum.toLowerCase() + 's']?.[
            availableRanges[quantum.toLowerCase() + 's'].length - 1
        ] || Number.MAX_SAFE_INTEGER;
    const availablePresets = extractQuantumScaleValues(quantum, quantums);
    if (!availablePresets) {
        return;
    }
    const allRangesPresets = getRangePresets(quantum, targetDate);
    if (!allRangesPresets) {
        return;
    }

    const currentRangeSize = getRangeSize(currentRange, quantum);
    const isIncrease = scaleDirection === 'increase';
    if (!isIncrease) {
        availablePresets.reverse();
    }

    const rangesAvailabilityMap = [
        DayRange.Week,
        DayRange.Month,
        MonthRange.Quarter,
        MonthRange.HalfYear,
    ].reduce(
        (acc, preset) => {
            acc[preset] =
                availablePresets.some((_p) => _p.value === preset) &&
                isRangeAvailable(quantum, quantums, preset, accessibility);
            return acc;
        },
        {} as Record<DayRange | MonthRange, boolean>
    );

    if (quantum === Quantum.Day) {
        // доступность пресетов
        const isWeekRangeAvailable = rangesAvailabilityMap[DayRange.Week];
        const isMonthRangeAvailable = rangesAvailabilityMap[DayRange.Month];
        // Для недель доп условие перехода к неделям - минимум дней 2 недели
        const daysInTwoWeeks = DAYS_IN_WEEK * 2;
        if (isIncrease) {
            // Если провалились из года и доступен месяц
            if (currentRangeSize > DAYS_IN_MONTH && isMonthRangeAvailable) {
                return allRangesPresets[DayRange.Month];
            }
            // Если провалились из месяца или нет месяца
            if (currentRangeSize >= daysInTwoWeeks && isWeekRangeAvailable) {
                return allRangesPresets[DayRange.Week];
            }
        } else {
            // Если поднялись из часов/30Мин/15Мин и доступна неделя
            if (currentRangeSize < DAYS_IN_WEEK && isWeekRangeAvailable) {
                return allRangesPresets[DayRange.Week];
            }
            // Берём min, т.к. часто maxRange может быть значительно больше, чем DAYS_IN_MONTH
            if (currentRangeSize < Math.min(maxRangeSize, DAYS_IN_MONTH) && isMonthRangeAvailable) {
                return allRangesPresets[DayRange.Month];
            }
            return;
        }
    } else if (quantum === Quantum.Month) {
        // доступность пресетов
        const isHalfYearRangeAvailable = rangesAvailabilityMap[MonthRange.HalfYear];
        const isQuarterYearRangeAvailable = rangesAvailabilityMap[MonthRange.Quarter];
        if (isIncrease) {
            // Если увеличиваем из года
            if (currentRangeSize > MONTHS_IN_HALFYEAR && isHalfYearRangeAvailable) {
                return allRangesPresets[MonthRange.HalfYear];
            }
            // Если увеличиваем хотя бы из полугодия
            if (currentRangeSize > MONTHS_IN_QUARTER && isQuarterYearRangeAvailable) {
                return allRangesPresets[MonthRange.Quarter];
            }
        } else {
            // Если поднимаемся из кванта День
            if (currentRangeSize < MONTHS_IN_QUARTER && isQuarterYearRangeAvailable) {
                return allRangesPresets[MonthRange.Quarter];
            }
            // Если поднимаемся хотя бы из Четверти
            if (currentRangeSize < MONTHS_IN_HALFYEAR && isHalfYearRangeAvailable) {
                return allRangesPresets[MonthRange.HalfYear];
            }
            if (currentRangeSize < MONTHS_IN_YEAR) {
                return allRangesPresets[MonthRange.Year];
            }
        }
    }
    return;
}

interface IZoomParams {
    quantum: Quantum;
    quantums: IQuantum[];
    currentRange: IRange;
    targetDate: Date;
    scaleDirection: TScaleDirection;
    accessibility: TQuantumRangeAccessibility;
    availableRanges?: Record<string, number[]>;
}

interface IZoomResult {
    range: IRange | undefined;
    quantum: Quantum | undefined;
    needScroll: boolean;
}

/**
 * Возвращает следующий период и квант в направлении масштабирования
 * Используется для проваливания при клике в заголовок или при зуме кнопками масштабирования
 * 1. Сначала проходим все пресеты периодов. Если нашли пресет, то меняем только range, а квант оставляем как прежде.
 * 2. Затем ищем следующий квант в группе периодов. Если нашли, то меняем только квант, а период оставляем как прежде. (Между Час-30мин-15мин, между День-неделя)
 * 3. Если ни квантов в группе периодов ни пресетов периода не найдено, меняем период к следующему кванту.
 * @param {Controls-Lists/timelineGrid:Quantum} quantum Квант, для которого производятся расчёты.
 * @param quantums {Array.<Controls-Lists/timelineGrid/IQuantum>} Пользовательская конфигурация квантов. Нужно подставить из слайса.
 * @param currentRange {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} range Отображаемый на таймлайне временной период
 * @param targetDate {Date} Дата, относительно которой происходит измененение масштаба
 * @param scaleDirection {String} Направление масштабирования сетки Таймлайн-таблицы
 * @param accessibility {String} Доступность масштабов для переключения. (zoom - для кнопок масштабирования или header - для кликов по звголовку)
 * @param availableRanges {Record<string, number[]>} Доступные диапазоны, расчитанные на основе ширины вьюпорта и ширины ячеек.
 */
export function zoom({
    quantum,
    quantums,
    currentRange,
    targetDate,
    scaleDirection,
    accessibility,
    availableRanges,
}: IZoomParams): IZoomResult {
    const dayRangesPresets = getRangePresets(Quantum.Day, targetDate);
    const isWeekRangeAvailable = isRangeAvailable(Quantum.Day, quantums, DayRange.Week, 'all');
    const isIncrease = scaleDirection === 'increase';
    // nextQuantum будет undefined, если мы из самого верхнего кванта нажали кнопку "-" или из самого нижнего нажали кнопку +
    const nextQuantum = getNextQuantum(quantum, quantums, scaleDirection);

    const getDayRangeByTargetDate = (_targetDate: Date): IRange => {
        const customRanges = getCustomRanges(quantums);
        const startDate = new Date(_targetDate);
        if (customRanges) {
            startDate.setHours(customRanges[0].start);
        } else {
            startDate.setHours(START_DAY_HOUR);
        }
        const endDate = new Date(_targetDate);
        if (customRanges) {
            endDate.setHours(customRanges[customRanges.length - 1].start);
        } else {
            endDate.setHours(END_DAY_HOUR);
        }
        return {
            start: startDate,
            end: endDate,
        };
    };

    // Нужно учитывать, что мы не должны запрашивать часы с 10:30 до 11:30,
    // или получасия с 10:45 до 11:15, поэтому нужно делать корректировку периода в соответствии с масштабом.
    if (nextQuantum && !isIncrease) {
        resetDateToStart(targetDate, nextQuantum);
    }
    let newRange: IRange | undefined;
    let needScroll: boolean = false;

    // Сначала проходим все пресеты периодов. Если нашли пресет, то меняем только range, а квант оставляем как прежде.
    newRange = getNextRangePreset({
        quantum,
        quantums,
        currentRange,
        targetDate,
        scaleDirection,
        accessibility,
        availableRanges,
    });

    if (newRange) {
        return {
            range: newRange,
            quantum,
            needScroll,
        };
    }

    if (!nextQuantum) {
        return {
            range: currentRange,
            quantum,
            needScroll,
        };
    }

    // Затем ищем следующий квант. Если нашли, то меняем только квант, а период оставляем как прежде.
    // Это доступно только при zoom кнопками масштабирования (Между Час-30мин-15мин, между День-7Дней)
    if (
        accessibility === 'zoom' &&
        nextQuantum &&
        areQuantsInSameRangeGroup(quantum, nextQuantum)
    ) {
        let range = currentRange;
        if (isQuantumLessThanDay(nextQuantum)) {
            // Необходимо сбросить дипазон, если перешли от Дней к Часам/30минут/15минут
            range = getDayRangeByTargetDate(targetDate);
        }
        return {
            range,
            quantum: nextQuantum,
            needScroll,
        };
    }

    // Проходим все пресеты периодов для следующего кванта по направлению масштабирования.
    // Если нашли подходящий пресет, то меняем только range, а квант оставляем как прежде
    // Квант определится по расчитаному range на уровне setRange
    newRange = getNextRangePreset({
        quantum: nextQuantum,
        quantums,
        currentRange,
        targetDate,
        scaleDirection,
        accessibility,
        availableRanges,
    });
    if (newRange) {
        return {
            range: newRange,
            quantum,
            needScroll,
        };
    }

    // Тут происходит переход из одного кванта в другой со сменой периода
    switch (quantum) {
        case Quantum.Hour:
        case Quantum.HalfHour:
        case Quantum.QuarterHour:
        case Quantum.Minute:
        case Quantum.Second:
            // считаем, что ниже кванта "час" мы не изменяем период,
            // тапм менется только квант. Возможно ,когда реально появятся "секунды",
            // тут придётся изменить логику
            if (!isIncrease) {
                // При выходе из режима дня в режим "Месяц":
                if (isWeekRangeAvailable) {
                    // Сначала пытаемся переключиться к неделям, если они разрешены
                    newRange = dayRangesPresets[DayRange.Week];
                } else {
                    // А далее переключаенмся к "режиму месяц"
                    newRange = dayRangesPresets[DayRange.Month];
                }
            }
            break;
        case Quantum.Week:
        case Quantum.Day:
            // Из дней мы можем провалится в часы или 30 минут или 15 минут.
            // Выход назад тут не учитываю, т.к. выше пытаюсь получить период по следующему кванту.
            if (isIncrease) {
                newRange = getDayRangeByTargetDate(targetDate);
                needScroll = true;
            } else {
                newRange = {
                    start: BaseDateUtils.getStartOfYear(targetDate),
                    end: BaseDateUtils.getEndOfYear(targetDate),
                };
            }
            break;
        case Quantum.HalfYear:
        case Quantum.Quarter:
        case Quantum.Month:
            if (isIncrease) {
                // Следующий квант - например неделя
                newRange = {
                    start: BaseDateUtils.getStartOfMonth(targetDate),
                    end: BaseDateUtils.getEndOfMonth(targetDate),
                };
                needScroll = true;
            }
            break;
        case Quantum.Year:
            newRange = {
                start: BaseDateUtils.getStartOfYear(targetDate),
                end: BaseDateUtils.getEndOfYear(targetDate),
            };
            break;
    }
    return {
        range: newRange,
        // undefined, чтобы вызвать setRange (квант будет заново автоматически рассчитан на основе range)
        quantum: undefined,
        needScroll,
    };
}

/**
 * Корректировка даты под часовой пояс МСК, чтобы сформировать запрос с правильной датой.
 * На клиенте выбрали дату (01.12.2023 00:00 +5 GMT). По МСК это (30.11.2023 22:00 +3 GMT).
 * Запрос следует делать по дате (01.12.2023 00:00 +3 GMT),
 * чтобы данные вернули именно за 1 декабря, а не 30 ноября.
 * @param date
 */
export function correctDateFromClientToServer(date: Date): Date {
    const tzOffset: number = DateTime.getClientTimezoneOffset() - DIFF_UTC_MSK;
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() - tzOffset);
    return newDate;
}

/**
 * Переводим дату, скорректированную под МСК обратно под клиентский ЧП
 * @param date
 */
export function correctDateFromServerToClient(date: Date): Date {
    const tzOffset: number = DateTime.getClientTimezoneOffset() - DIFF_UTC_MSK;
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + tzOffset);
    return newDate;
}

/*
 * Возвращает насыщенность событий по переданному дапазону
 * @param {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} range Отображаемый на таймлайне временной период
 * @param quantsReplacementMap
 * @returns {Controls-Lists/_timelineGrid/utils/Utils/TEventSaturation.typedef}
 */
export function getEventsSaturation(
    range: IRange,
    quantsReplacementMap?: TQuantsReplacementMap
): TEventSaturation {
    const quantum = getQuantum(range, quantsReplacementMap);
    const rangeSize = getRangeSize(range, quantum);
    return quantum === 'second' ||
        quantum === 'minute' ||
        quantum === 'hour' ||
        (quantum === 'day' && rangeSize <= 14)
        ? 'max'
        : quantum === 'day'
        ? 'mid'
        : 'min';
}

/*
 * Изменяет по ссылке переданную дату, добавляя или убавляя часы, дни, месяцы в зависимости от направления, кванта и коэффициента смещения
 * @param {Date} date Дата для изменения
 * @param {String} direction Направление смещения, forwards - добавляет, backwards - убавляет
 * @param {Controls-Lists/timelineGrid:Quantum} quantum Квант, для которого производятся расчёты. Если передан квант 'day', то происходит смещение дней, если 'month' - смещение месяца. При кванте 'hour' могут изменяться дни и часы.
 * @param {Number} shiftFactor Коэффициент смещения. По умолчанию имеет значение 1.
 */
export function shiftDate(
    date: Date,
    direction: Exclude<TNavigationDirection, 'bothways'>,
    quantum: Quantum,
    shiftFactor: number = 1,
    customRanges?: ICustomRange[]
): Date {
    const sign = direction === 'backward' ? -1 : 1;
    const shiftSize = sign * shiftFactor;
    let rangesStart;
    if (customRanges && quantum === 'hour') {
        rangesStart = customRanges.map((range) => {
            return range.start;
        });
    }
    switch (quantum) {
        case Quantum.Second:
            date.setSeconds(date.getSeconds() + shiftSize);
            break;
        case Quantum.Minute:
            date.setMinutes(date.getMinutes() + shiftSize);
            break;
        case Quantum.HalfHour:
            date.setMinutes(date.getMinutes() + shiftSize * MINUTES_IN_HALF_HOUR);
            break;
        case Quantum.QuarterHour:
            date.setMinutes(date.getMinutes() + shiftSize * MINUTES_IN_QUARTER_HOUR);
            break;
        case Quantum.Hour:
            // Находясь в начале дня, нажали стрелку назад -> Показываем прошлый день с Min(начало активности, 0 часов).
            if (date.getHours() === START_DAY_HOUR && shiftSize < 0) {
                date.setDate(date.getDate() - 1);
                date.setHours(END_DAY_HOUR + 1);
            }
            // Находясь в конце дня, нажали стрелку вперед -> Показываем следующий день с Min(начало активности, 0 часов).
            else if (date.getHours() === END_DAY_HOUR && shiftSize > 0) {
                date.setDate(date.getDate() + 1);
                date.setHours(START_DAY_HOUR - 1);
            }

            if (rangesStart) {
                const index = rangesStart.findIndex((start) => {
                    return date.getHours() === start;
                });
                const position = (index + shiftFactor) % rangesStart.length;
                const days = Math.trunc(((index + shiftFactor) * sign) / rangesStart.length);
                date.setHours(rangesStart[position]);
                date.setDate(date.getDate() + days);
            } else {
                date.setHours(date.getHours() + shiftSize);
            }

            // Если сместили на 12 часов с начала дня, то нужно сдвинуться на начало следующего дня
            if (date.getHours() === END_DAY_HOUR + 1) {
                date.setDate(date.getDate() + 1);
                date.setHours(START_DAY_HOUR);
            }

            if (date.getHours() < START_DAY_HOUR || date.getHours() > END_DAY_HOUR) {
                Logger.error(
                    `Wrong hours in date. Should be time ${START_DAY_HOUR}:00-${
                        END_DAY_HOUR + 1
                    }:00.`
                );
            }
            break;
        case Quantum.Day:
            date.setDate(date.getDate() + shiftSize);
            break;
        case Quantum.Week:
            const prevTime = BaseDateUtils.getStartOfWeek(date).getTime();
            const deltaTime = shiftSize * DAYS_IN_WEEK * DAY_IN_MS;
            date.setTime(prevTime + deltaTime);
            break;
        case Quantum.Month:
            date.setMonth(date.getMonth() + shiftSize);
            break;
        case Quantum.Quarter:
            date.setMonth(date.getMonth() + shiftSize * MONTHS_IN_QUARTER);
            break;
        case Quantum.HalfYear:
            date.setMonth(date.getMonth() + shiftSize * MONTHS_IN_HALFYEAR);
            break;
        case Quantum.Year:
            date.setFullYear(date.getFullYear() + shiftSize);
            break;
    }
    return date;
}

// Возвращает минимальную ширину динамических колонок.
export function getMinColumnWidth(
    dynamicColumn: IDynamicColumnConfig<Date>,
    dynamicColumnMinWidths: TDynamicColumnMinWidths,
    quantum: Quantum
): number {
    const minWidthProp = dynamicColumnMinWidths?.[quantum] || dynamicColumn.minWidth;
    return minWidthProp ? parseInt(minWidthProp, 10) : DEFAULT_MIN_DYNAMIC_COLUMN_WIDTH;
}

// Возвращает максимальную ширину динамических колонок.
export function getMaxColumnWidth(
    dynamicColumn: IDynamicColumnConfig<Date>,
    dynamicColumnMaxWidths: TDynamicColumnMinWidths,
    quantum: Quantum
): number {
    const maxWidthProp = dynamicColumnMaxWidths?.[quantum] || dynamicColumn.maxWidth;
    return maxWidthProp ? parseInt(maxWidthProp, 10) : DEFAULT_MIN_DYNAMIC_COLUMN_WIDTH;
}

/*
 * Утилита рассчитывает карту периодов, скорректированных с учётом ширины вьюопрта.
 * @param viewportWidth
 * @param dynamicColumn
 * @param columnGapSize
 * @param hasMultiSelectColumn
 * @param dynamicColumnMinWidths
 */
export function getAvailableRanges(
    viewportWidth: number,
    dynamicColumn: IDynamicColumnConfig<Date>,
    columnGapSize: number,
    hasMultiSelectColumn: boolean,
    dynamicColumnMinWidths: TDynamicColumnMinWidths
): Record<string, number[]> {
    // min sizes
    const minDayWidth = getMinColumnWidth(dynamicColumn, dynamicColumnMinWidths, Quantum.Day);
    const minWeekWidth = getMinColumnWidth(dynamicColumn, dynamicColumnMinWidths, Quantum.Week);
    const minMonthWidth = getMinColumnWidth(dynamicColumn, dynamicColumnMinWidths, Quantum.Month);
    const minQuarterWidth = getMinColumnWidth(
        dynamicColumn,
        dynamicColumnMinWidths,
        Quantum.Quarter
    );
    const minHalfYearWidth = getMinColumnWidth(
        dynamicColumn,
        dynamicColumnMinWidths,
        Quantum.HalfYear
    );
    const minYearWidth = getMinColumnWidth(dynamicColumn, dynamicColumnMinWidths, Quantum.Year);
    const checkboxWidth = hasMultiSelectColumn ? CHECKBOX_COLUMN_WIDTH : 0;

    const _calcMaxRangeSize = (_minWidth: number) => {
        return Math.floor(
            (viewportWidth - columnGapSize - checkboxWidth) / (_minWidth + columnGapSize)
        );
    };

    // max range sizes
    const maxDayRangeSize = _calcMaxRangeSize(minDayWidth);
    const maxWeekRangeSize = _calcMaxRangeSize(minWeekWidth);
    const maxMonthRangeSize = _calcMaxRangeSize(minMonthWidth);
    const maxQuarterRangeSize = _calcMaxRangeSize(minQuarterWidth);
    const maxHalfYearRangeSize = _calcMaxRangeSize(minHalfYearWidth);
    const maxYearRangeSize = _calcMaxRangeSize(minYearWidth);

    // max counts
    const maxDays = Math.min(maxDayRangeSize, DAYS_IN_TWO_MONTHS);
    const maxWeeks = Math.min(maxWeekRangeSize, WEEKS_IN_QUARTER);
    const maxMonth = Math.min(maxMonthRangeSize, MONTHS_IN_YEAR);

    // пока год бывает только в периоде год, не больше, поэтому это частный случай представления месяцев в году
    const maxQuarters = Math.min(maxQuarterRangeSize, QUARTER);
    const maxHalfYears = Math.min(maxHalfYearRangeSize, HALF);
    const maxYears = Math.min(maxYearRangeSize, YEARS_BY_DEFAULT);

    // Если нельзя выбрать дней на 1 или 2 месяца, то нет смысла давать выбрать 1 или 2 месяца целиком.
    // Следующий масштаб - 3 месяца по месяцам.
    const canSelectOneMonth = maxDays >= DAYS_IN_MONTH;
    const canSelectTwoMonths = maxDays >= DAYS_IN_TWO_MONTHS;

    let months = Array.from({ length: maxMonth + 1 }, (_, i) => i).slice(3);
    if (canSelectTwoMonths && maxMonth >= 2) {
        months = [2, ...months];
    }
    if (canSelectOneMonth) {
        months = [1, ...months];
    }

    return {
        days: Array.from({ length: maxDays + 1 }, (_, i) => i).slice(1),
        weeks: Array.from({ length: maxWeeks + 1 }, (_, i) => i).slice(1),
        months,
        quarters: Array.from({ length: maxQuarters + 1 }, (_, i) => i).slice(1),
        halfyears: Array.from({ length: maxHalfYears + 1 }, (_, i) => i).slice(1),
        years: Array.from({ length: maxYears + 1 }, (_, i) => i).slice(1),
    };
}

interface IUpdateRange {
    currentViewportWidth: number;
    nextViewportWidth: number;
    range: IRange;
    quantsReplacementMap: TQuantsReplacementMap;
    columnGapSize: number;
    hasMultiSelectColumn: boolean;
}

interface IUpdateRangeOnSlice {
    slice: TimelineGridSlice;
    currentViewportWidth: number;
    nextViewportWidth: number;
    dynamicColumnMinWidths: TDynamicColumnMinWidths;
    columnGapSize: number;
}

/**
 * Обновить временной период отображаемого периода в соответствии с шириной рабочей области динамической сетки
 * @param {IUpdateRange} params
 */
function updateRange(params: IUpdateRange): IRange {
    const {
        range,
        quantsReplacementMap,
        nextViewportWidth,
        currentViewportWidth,
        columnGapSize,
        hasMultiSelectColumn,
    } = params;
    const quantum = getQuantum(range, quantsReplacementMap);
    const rangeSize = getRangeSize(range, quantum);
    if (quantum !== 'month' || rangeSize < MONTHS_IN_YEAR) {
        const checkboxWidth = hasMultiSelectColumn ? CHECKBOX_COLUMN_WIDTH : 0;
        const availableCurrentViewportWidth =
            currentViewportWidth - columnGapSize * (rangeSize + 1) - checkboxWidth;
        const dynamicColumnWidth = availableCurrentViewportWidth / rangeSize;
        const newRangeSize = Math.floor(
            (nextViewportWidth - columnGapSize - checkboxWidth) /
                (dynamicColumnWidth + columnGapSize)
        );
        let endDate = new Date(range.start);
        endDate = shiftDate(endDate, 'forward', quantum, newRangeSize);
        return {
            start: range.start,
            end: endDate,
        };
    }
    return range;
}

export function updateRangeOnSlice(params: IUpdateRangeOnSlice) {
    const {
        slice,
        dynamicColumnMinWidths,
        columnGapSize,
        nextViewportWidth,
        currentViewportWidth,
    } = params;
    const newRange = updateRange({
        currentViewportWidth,
        nextViewportWidth,
        range: slice.range,
        quantsReplacementMap: slice.state.quantsReplacementMap,
        columnGapSize,
        hasMultiSelectColumn:
            slice.multiSelectVisibility !== 'hidden' && slice.multiSelectPosition !== 'custom',
    });
    const availableRanges = getAvailableRanges(
        nextViewportWidth,
        slice.dynamicColumn,
        columnGapSize,
        slice.multiSelectVisibility !== 'hidden' && slice.multiSelectPosition !== 'custom',
        dynamicColumnMinWidths
    );
    slice.applyAvailableRanges(availableRanges);
    slice.setRange(newRange);
}

/**
 * Метод вырезает видимый кусок из всего массива динамических колонок, необходимо для выключения бесконечного скролла
 * @param params
 */
export function findStrictRange(params: {
    dynamicColumnsGridData: Date[];
    startDate: Date;
    endDate: Date;
}): Date[] {
    const { dynamicColumnsGridData, startDate, endDate } = params;

    if (dynamicColumnsGridData.length === 0 || startDate > endDate) {
        return [];
    }

    // Ищем первый элемент === startDate
    const startIndex = dynamicColumnsGridData.findIndex(
        (date) => date.getTime() === startDate.getTime()
    );

    // Ищем последний элемент === endDate
    let endIndex = -1;
    for (let i = dynamicColumnsGridData.length - 1; i >= 0; i--) {
        if (dynamicColumnsGridData[i].getTime() === endDate.getTime()) {
            endIndex = i;
            break;
        }
    }

    // Проверяем валидность индексов
    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
        return [];
    }

    return dynamicColumnsGridData.slice(startIndex, endIndex + 1);
}

export function getCustomRanges(quantumns: IQuantum[]): ICustomRange[] | undefined {
    const quantumHour = quantumns?.find((quantum) => {
        return quantum.name === 'hour';
    });
    return quantumHour?.customRanges;
}

/**
 * Утилиты для работы с таймлайн таблицей
 * @class Controls-Lists/_timelineGrid/utils/Utils
 * @public
 */
const Utils = {
    /**
     * Возвращает квант таймлайна по переданному временному периоду.
     * @function Controls-Lists/_timelineGrid/utils/Utils#getQuantum
     * @param {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} range Отображаемый на таймлайне временной период
     */
    getQuantum,
    /**
     * Изменяет по ссылке переданную дату, добавляя или убавляя часы, дни, месяцы в зависимости от направления, кванта и коэффициента смещения
     * @function Controls-Lists/_timelineGrid/utils/Utils#shiftDate
     * @param {Date} date Дата для изменения
     * @param {String} direction Направление смещения, forwards - добавляет, backwards - убавляет
     * @param {Controls-Lists/timelineGrid:Quantum} quantum Квант, для которого производятся расчёты. Если передан квант 'day', то происходит смещение дней, если 'month' - смещение месяца. При кванте 'hour' могут изменяться дни и часы.
     * @param {Number} shiftFactor Коэффициент смещения. По умолчанию имеет значение 1.
     * @returns {Date} Date
     */
    shiftDate,
    /**
     * Возвращает насыщенность событий по переданному дапазону
     * @function Controls-Lists/_timelineGrid/utils/Utils#getEventsSaturation
     * @param {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} range Отображаемый на таймлайне временной период
     */
    getEventsSaturation,
};

export { Utils };

import { WidgetType, ArrayType, StringType, BooleanType } from 'Meta/types';
import { RecordSet } from 'Types/collection';
import * as translate from 'i18n!Controls-ListEnv-meta';

/**
 * Дефолтный набор доступных периодов
 */
export const defaultDateRangeType = ['today', 'yesterday', 'week', 'month'];
/**
 * Дефолтное значение фильтра по периоду
 */
export const defaultDateRange = 'month';
/**
 * Дефолтный тип периода
 */
export const defaultType = 'current';

/**
 * Набор доступных для выбора значений периода
 */
export const dateRangeData = [
    {
        value: 'all',
        caption: translate('Весь период'),
    },
    {
        value: 'today',
        caption: translate('Сегодня'),
    },
    {
        value: 'yesterday',
        caption: translate('Вчера'),
    },
    {
        value: 'tomorrow',
        caption: translate('Завтра'),
    },
    {
        value: 'week',
        caption: translate('Неделя'),
    },
    {
        value: 'month',
        caption: translate('Месяц'),
    },
    {
        value: 'quarter',
        caption: translate('Квартал'),
    },
    {
        value: 'halfyear',
        caption: translate('Полгода'),
    },
    {
        value: 'year',
        caption: translate('Год'),
    },
    {
        value: 'arbitrary',
        caption: translate('Произвольный'),
    },
];

export const defaultValue = {
    dateRangeType: defaultDateRangeType,
    defaultDateRange,
};

/**
 * Набор вариантов значений минимального диапазона дат
 */
export const minRangeData = [
    {
        value: 'dayArbitrary',
        caption: translate('День'),
    },
    {
        value: 'monthArbitrary',
        caption: translate('Месяц'),
    },
    {
        value: 'quarterArbitrary',
        caption: translate('Квартал'),
    },
    {
        value: 'yearArbitrary',
        caption: translate('Год'),
    },
];

/**
 * Порядок фильтра по периоду
 */
const DATE_ORDER = 40;

/**
 * Метатип минимального диапазона дат
 */
export const minRange = StringType.id('minRange')
    .optional()
    .title(translate('Минимум'))
    .defaultValue('dayArbitrary');

/**
 * Метатип фильтра по периоду
 */
export const metaType = WidgetType.id('DateRangeFilterItemType')
    .category('filterItem')
    .title(translate('Период'))
    .defaultValue(defaultValue)
    .order(DATE_ORDER)
    .attributes({
        type: StringType.id('type')
            .optional()
            .title(translate('Тип'))
            .defaultValue(defaultType)
            .order(0)
            .editor('Controls-editors/toggle:TumblerEditor')
            .editorProps({
                options: new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        {
                            id: defaultType,
                            title: translate('Текущий'),
                        },
                        {
                            id: 'last',
                            title: translate('Последний'),
                        },
                    ],
                }),
            }),
        dateRangeType: ArrayType.of(StringType)
            .id('dateRangeType')
            .optional()
            .title(translate('Доступные'))
            .defaultValue(defaultDateRangeType)
            .order(1)
            .editor('Controls-editors/dropdown:MultiEnumEditor')
            .editorProps({
                options: dateRangeData,
                menuPopupOptions: {
                    fittingMode: {
                        vertical: 'overflow',
                    },
                },
            }),
        defaultDateRange: StringType.id('defaultDateRange')
            .optional()
            .title(translate('По умолчанию'))
            .defaultValue(defaultDateRange)
            .order(2)
            .editor('Controls-editors/dropdown:EnumEditor')
            .editorProps({
                options: dateRangeData,
            }),
        minRange,
        position: StringType.id('position')
            .optional()
            .title(translate('Расположение'))
            .defaultValue('right')
            .order(3)
            .editor('Controls-editors/toggle:TumblerEditor')
            .editorProps({
                options: new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        {
                            id: 'left',
                            title: translate('Слева'),
                        },
                        {
                            id: 'right',
                            title: translate('Справа'),
                        },
                    ],
                }),
            }),
        arrows: BooleanType.id('arrows')
            .optional()
            .title(translate('Стрелки'))
            .defaultValue(false)
            .order(4)
            .editor('Controls-editors/toggle:SwitchEditor'),
        filterSourceGetter: StringType.id('filterSourceGetter')
            .optional()
            .defaultValue('Controls-ListEnv-editors/dateRangeSource:getFilterSource')
            .hidden(),
    });

const metaTypeWithEditor = metaType
    .editor('Controls-ListEnv-editors/dateRangeEditor:DateRangeEditor')
    .editorProps({
        metaTypeWithoutEditor: metaType,
        minRange,
    });

export default metaTypeWithEditor;

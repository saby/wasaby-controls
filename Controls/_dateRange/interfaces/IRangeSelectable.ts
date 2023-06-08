/**
 * @kaizen_zone 98febf5d-f644-4802-876c-9afd0e12cf6a
 */
import { descriptor } from 'Types/entity';

/**
 * Интерфейс контролов, позволяющих выделять интервалы от одного значения до другого.
 * @interface Controls/_dateRange/interfaces/IRangeSelectable
 * @public
 */
const selectionTypes = {
    range: 'range',
    single: 'single',
    quantum: 'quantum',
    disable: 'disable',
    workdays: 'workdays',
};

export default {
    getDefaultOptions() {
        return {
            // TODO: имеет ли смысл оставлять опуию selectionType? selectionType: 'single',
            //  это частный случай quantum: {days: [1]}
            //  Возможно стоит оставить, но ввести selectionType: 'quantum' и
            //  сделать что бы опция quantum работала только в этом случае.
            /**
             * @typedef {String} SelectionType
             * @description Режим выделения диапазона.
             * @variant range Выделение произвольного диапазона.
             * @variant single Выделение одного элемента.
             * @variant disable Выбора диапазона отключен.
             * @variant workdays Выбор рабочей недели
             */
            /**
             * @name Controls/_dateRange/interfaces/IRangeSelectable#selectionType
             * @cfg {SelectionType} Определяет режим выделения диапазона.
             * @default range
             * @demo Controls-demo/dateRange/RangeSelector/SelectionType/Workdays/Index
             */
            selectionType: 'range',
        };
    },

    SELECTION_TYPES: selectionTypes,

    getOptionTypes() {
        return {
            selectionType: descriptor(String).oneOf(
                Object.keys(selectionTypes)
            ),
        };
    },
};

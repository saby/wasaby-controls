/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import type { MultiSelectAccessibility } from 'Controls/display';
import { TItemKey } from 'Controls-Lists/_dynamicGrid/shared/types';
import { TColumnKey } from 'Controls-Lists/_dynamicGrid/selection/shared/types';
import { TVisibility } from 'Controls/interface';

/**
 * Тип данных для мультивыбора ячеек.
 * Объект, ключи которого соответствуют ключам записей, а значение является массивом ключей колонок
 * @typedef {Map<CrudEntityKey, Array<Controls/gridReact:TColumnKey>>} Controls-Lists/dynamicGrid/TSelectionMap
 */
export type TSelectionMap = Record<TItemKey, TColumnKey[]>;

/**
 * функция обратного вызова для определения доступности чекбокса в конкретной ячейке.
 * Аргументы:
 * * itemKey: TItemKey
 * * columnKey: TColumnKey
 * Возвращает: {@link Controls/display:MultiSelectAccessibility доступность чекбокса для ячейки}
 * @typedef {Function} Controls-Lists/dynamicGrid/TCellsMultiSelectAccessibilityCallback
 */
export type TCellsMultiSelectAccessibilityCallback = (
    itemKey: TItemKey,
    columnKey: TColumnKey
) => (typeof MultiSelectAccessibility)[keyof typeof MultiSelectAccessibility];

/**
 * Тип функции обратного вызова при изменении мультивыбора ячеек.
 * Аргументы:
 * * {@link Controls-Lists/dynamicGrid/TSelectionMap.typedef объект с выбранными ячейками}
 * @typedef {Function} Controls-Lists/_dynamicGrid/selection/shared/interface/ICellsMultiSelectAccessibility/TOnSelectionChangedCallback
 */
export type TOnSelectionChangedCallback = (selection: TSelectionMap) => void;

/**
 * Тип функции обратного вызова до изменения мультивыбора ячеек.
 * Аргументы:
 * * {@link Controls-Lists/dynamicGrid/TSelectionMap.typedef Предыдущий объект с выбранными ячейками}
 * * {@link Controls-Lists/dynamicGrid/TSelectionMap.typedef Новый объект с выбранными ячейками}
 * Возвращает: {@link Controls-Lists/dynamicGrid/TSelectionMap.typedef Объект с выбранными ячейками}
 * @typedef Controls-Lists/_dynamicGrid/selection/shared/interface/ICellsMultiSelectAccessibility/TOnBeforeSelectionChangeCallback
 */
export type TOnBeforeSelectionChangeCallback = (
    oldSelection: TSelectionMap,
    newSelection: TSelectionMap
) => TSelectionMap;

/**
 * @typedef {String} Controls-Lists/dynamicGrid/TCellsMultiSelectVisibility
 * @variant hidden чекбоксы в ячейках скрыты
 * @variant onhover чекбоксы в ячейках появляются по ховеру на ячейку
 */
export type TCellsMultiSelectVisibility = Extract<TVisibility, 'hidden' | 'onhover'>;

/**
 * Интерфейс конфигурации множественного выбора ячеек
 * @interface Controls-Lists/_dynamicGrid/selection/shared/interface/ICellsMultiSelectAccessibility
 * @public
 */
export interface ICellsMultiSelectAccessibility {
    /**
     * Видимость множественноо выбора ячеек
     * @cfg {Controls-Lists/dynamicGrid/TCellsMultiSelectVisibility.typedef}
     */
    cellsMultiSelectVisibility?: TCellsMultiSelectVisibility;
    /**
     * Функция, позволяющая определить доступность множественноо выбора для конкретных ячеек
     * @cfg {Controls-Lists/dynamicGrid/TCellsMultiSelectAccessibilityCallback.typedef}
     * @example
     * <pre class="brush: js">
     * import { MultiSelectAccessibility } from 'Controls/display';
     *
     * dataFactoryArguments: {
     *     cellsMultiSelectAccessibilityCallback: (itemKey, columnKey) => {
     *         return (itemKey === 6 || itemKey === '6') &&
     *                new Date(columnKey) < new Date('Mon, 23 Jan 2023 21:00:00 GMT') ?
     *            MultiSelectAccessibility.hidden :
     *            MultiSelectAccessibility.enabled;
     *    },
     * }
     * </pre>
     */
    cellsMultiSelectAccessibilityCallback?: TCellsMultiSelectAccessibilityCallback;
    /**
     * Объект с выбранными ячейками.
     * В качестве ключей принимает ключ записи, а в качестве значений - массив ключей динамических колонок
     * @cfg {Controls-Lists/dynamicGrid/TSelectionMap.typedef}
     * @example
     * <pre class="brush: js">
     *     dataFactoryArguments: {
     *          ...,
     *          selectedCells: {
     *              2: [
     *                  'Sat, 07 Jan 2023 21:00:00 GMT',
     *                  'Sun, 08 Jan 2023 21:00:00 GMT',
     *                  'Mon, 09 Jan 2023 21:00:00 GMT',
     *                  'Thu, 12 Jan 2023 21:00:00 GMT',
     *              ],
     *              3: ['Sat, 07 Jan 2023 21:00:00 GMT', 'Sun, 08 Jan 2023 21:00:00 GMT'],
     *              4: [
     *                  'Sat, 07 Jan 2023 21:00:00 GMT',
     *                  'Sun, 08 Jan 2023 21:00:00 GMT',
     *                  'Wed, 11 Jan 2023 21:00:00 GMT',
     *                  'Thu, 12 Jan 2023 21:00:00 GMT',
     *              ],
     *          },
     *     }
     * </pre>
     */
    selectedCells?: TSelectionMap;
}

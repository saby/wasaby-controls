import type { ReactElement } from 'react';
import type { ICompatibleColumnConfig } from 'Controls/gridDisplay';
import { IColumnDataDecoratorProps } from 'Controls/_gridRender/cell/interface/IColumnDataDecoratorProps';
import { IColumnSeparatorSizeConfig } from 'Controls/_gridDisplay/interface/IColumn';
import { IBaseColumnConfig } from 'Controls/_gridRender/cell/interface/IBaseColumnConfig';

/**
 * Тип для ограничения значений ширины {number}px
 * @typedef TPixels
 */
export type TPixels = `${number}px`;

/**
 * Тип для ограничения значений ширины {number}%
 * @typedef TPercents
 */
export type TPercents = `${number}%`;

/**
 * Тип для ограничения значений ширины {number}fr
 * @typedef TFractures
 */
export type TFractures = `${number}fr`;

/**
 * Тип для ограничения значений ширины когстантами
 * @typedef TWidthConstants
 * @variant 'auto'
 * @variant 'min-content'
 * @variant 'max-content'
 */
export type TWidthConstants = 'auto' | 'min-content' | 'max-content';

/**
 * Тип для ограничения значений ширины
 * @typedef TWidthUnits
 * @variant 'auto'
 * @variant 'min-content'
 * @variant 'max-content'
 */
export type TWidthUnits = TWidthConstants | TPixels | TPercents | TFractures;

/**
 * Варианты значений ширины колонки
 * @typedef TColumnWidth
 * @variant {number}px Значение в пикселях
 * @variant {number}% Значение в процентах от ширины грид-контейнера
 * @variant {number}fr В частях (фракциях). Пропорционально ширине оставшегося в таблице места после вычета всех ширин колонок, заданных иными методами. Ширина колонки вычисляется по формуле: ("ширина места под таблицу" - "ширины всех колонок, заданных не фракциями") / "общее число фракций в таблице" х "число фракций в колонке".
 * @variant auto Авторасчет. Ширина колонки рассчитывается автоматически в интервале от Min-Content до Max-content. Оставшееся в таблице место распределяется между колонками с такой шириной (актуально только в случае, если в таблице нет колонок с шириной во фракциях).
 * @variant min-content По минимальному контенту. Ширина колонки определяется по самой длинной несжимаемой (которая не может быть перенесена на другую строку) части контента в её ячейках, т.е. по минимально возможному корректно отображенному контенту.
 * @variant max-content По максимальному контенту. Ширина колонки определяется по самому длинному контенту в её ячейках.
 */
export type TColumnWidth = TWidthUnits | `minmax(${TWidthUnits}, ${TWidthUnits})` | string;

/**
 * Варианты поддерживаемых декораторов для отображения данных в колонке
 * @typedef TColumnDataDecorator
 * @variant money Деньги. Данные колонки будут отформатированы с помощью декоратора {@link Controls/baseDecorator:Money}.
 * @variant number Число. Данные колонки будут отформатированы с помощью декоратора {@link Controls/baseDecorator:Number}.
 * @variant date Дата. Данные колонки будут отформатированы с помощью декоратора {@link Controls/baseDecorator:Date}.
 * @variant string Строка.
 */
export type TColumnDataDecorator = 'money' | 'number' | 'date' | 'string' | string;

/**
 * Конфигурация колонки
 * @public
 */
export interface IColumnConfig extends IBaseColumnConfig, ICompatibleColumnConfig {
    /**
     * Имя поля, данные которого отображаются в колонке.
     * Если задан {@link render} и {@link key} то это поле не нужно задавать.
     * @cfg
     */
    displayProperty?: string;

    // region displayType

    /**
     * Название платформенного декоратора для отображения данных в колонке.
     * @cfg
     * @default string
     * @remark
     * Конфигурация декоратора задается в опции {@link displayTypeOptions}.
     * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/columns/visual/type/ здесь}.
     * @example
     * В следующем примере показано как отобразить поле записи типа "число"
     *
     * <pre class="brush: js; highlight: [2]">
     * // TypeScript
     * const columns: IColumnConfig[] = [
     *     {
     *         displayProperty: 'price',
     *         displayType: 'number'
     *     }
     * ]
     * </pre>
     * @see displayTypeOptions
     */
    displayType?: TColumnDataDecorator;
    /**
     * Конфигурация декоратора (см. {@link Controls/gridRender/IColumnConfig/Property/displayType displayType}), который используется для отображения данных в колонке.
     * @cfg
     * @example
     * В следующем примере показано как отключить подсветку данных при поиске.
     *
     * <pre class="brush: js">
     * // TypeScript
     * const columns: IColumnConfig[] = [
     *     {
     *         displayProperty: 'price',
     *         displayType: 'string',
     *         displayTypeOptions: {
     *             searchHighlight: false
     *         }
     *     },
     * ]
     * </pre>
     *
     * В следующем примере показано как отобразить поле записи типа "деньги" без группировки триад цифр.
     *
     * <pre class="brush: js">
     * // TypeScript
     * const columns: IColumnConfig[] = [
     *     {
     *         displayProperty: 'price',
     *         displayType: 'money',
     *         displayTypeOptions: {
     *             useGrouping: false
     *         }
     *     },
     *     ...
     * ]
     * </pre>
     * @see displayType
     */
    displayTypeOptions?: IColumnDataDecoratorProps;

    // endregion displayType

    // region Width

    /**
     * Ширина колонки.
     * @cfg
     * @remark
     * В качестве значения свойства можно указать пиксели (px), проценты (%), доли (1fr), "auto", "minmax", "max-content" и "min-content".
     * В значении "auto" ширина колонки устанавливается автоматически исходя из типа и содержимого элемента.
     * В значении "minmax(,)" ширина колонки устанавливается автоматически в рамках заданного интервала. Например, "minmax(600px, 1fr)" означает, что минимальная ширина колонки 600px, а максимальная — 1fr.
     * В значении "max-content" ширина колонки устанавливается автоматически в зависимости от самой большой ячейки. Например, если в первой строке ширина ячейки 100px, а во второй строке — 200px, тогда ширина колонки будет определена как 200px.
     * В значении "min-content" для колонки устанавливается наименьшая возможная ширина, при которой не возникает переполнения ячейки. Например, если в первой строке ячейка содержит контент "Первая строка", а во второй — "Содержимое второй строки" и включен перенос по словам, то ширина рассчитается по наиболее широкому непереносимому слову, а это слово "Содержимое" из второй строки.
     * Для браузеров, которые не поддерживают технологию {@link https://developer.mozilla.org/ru/docs/web/css/css_grid_layout CSS Grid Layout}, не работает ширина колонки, указанная в долях, "auto" или "minmax". Для таких браузеров используйте свойство {@link compatibleWidth}.
     * При установке ширины фиксированным колонкам рекомендуется использовать абсолютные величины (px). От конфигурации ширины фиксированных колонок зависит ширина скроллируемой области. Например, при установке ширины фиксированной колонки 1fr её контент может растянуться на всю ширину таблицы, и в результате не останется свободного пространства для скролла.
     * @see compatibleWidth
     */
    width?: TColumnWidth;

    /**
     * Минимальная ширина колонки.
     * @cfg
     */
    minWidth?: TPixels;

    /**
     * Максимальная ширина колонки.
     * @cfg
     */
    maxWidth?: TPixels;

    /**
     * Ширина колонки в браузерах, не поддерживающих {@link https://developer.mozilla.org/ru/docs/web/css/css_grid_layout CSS Grid Layout}.
     * @cfg
     * @remark
     * В качестве значения свойства можно указать только пиксели (px) или проценты (%). Если свойство не задано, применяется значение "auto".
     * @demo Controls-demo/gridNew/Columns/CellNoClickable/Index В демо-примере в конфигурации третьей колонки свойство compatibleWidth установлено в значение 98px.
     * @see width
     */
    compatibleWidth?: TPixels | TPercents;

    // endregion Width

    /**
     * Поле с текстом подсказки при наведении на ячейку
     * @cfg
     * @demo Controls-demo/gridNew/Columns/Tooltip/Index
     */
    tooltipProperty?: string;

    /**
     * Компонент, используемый для отрисовки ячейки в режиме редактирования.
     * @cfg
     */
    editorRender?: ReactElement;

    /**
     * Ширина разделителей между колонками.
     * @cfg
     * @default null
     * @remark
     * Ширину линии-разделителя между двумя колонками можно задать на любой из них (левую или правую соответственно).
     * В случае, если одна и та же граница была определена на двух ячейках, приоритет отдается ячейке, для которой эта граница является левой.
     */
    columnSeparatorSize?: IColumnSeparatorSizeConfig;
}

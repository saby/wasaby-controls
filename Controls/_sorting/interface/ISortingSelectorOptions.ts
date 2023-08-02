/**
 * @kaizen_zone ed546588-e113-4fa9-a709-b37c7f5cc99c
 */
import { IControlOptions } from 'UI/Base';
import {
    IFontSizeOptions,
    IFontColorStyleOptions,
    TIconSize,
    IIconSizeOptions,
} from 'Controls/interface';
import { IViewMode } from 'Controls/buttons';
import { ISortingParam } from 'Controls/_sorting/interface/ISortingParam';

/**
 * Значения для размеров иконки в меню сортировки.
 * @typedef {String} Controls/_sorting/interface/ISortingSelector/TMenuIconSize
 * @variant s малый
 * @variant m средний
 */
export type TMenuIconSize = Extract<TIconSize, 's' | 'm'>;

/**
 * Интерфейс опций для конфигурации параметров сортировки.
 * @interface Controls/_sorting/interface/ISortingSelector
 * @public
 */
export interface ISortingSelectorOptions
    extends IControlOptions,
        IFontColorStyleOptions,
        IFontSizeOptions,
        IIconSizeOptions {
    /**
     * @name Controls/_sorting/interface/ISortingSelector#sortingParams
     * @cfg {Array.<Controls/_sorting/interface/ISortingParam>} Параметры сортировки.
     * @demo Controls-demo/gridNew/Sorting/SortingSelector/Default/Index
     * @demo Controls-demo/gridNew/Sorting/SortingSelector/SortingSelectorWithReset/Index
     * @demo Controls-demo/gridNew/Sorting/SortingSelector/Icons/Index
     * @demo Controls-demo/gridNew/Sorting/SortingSelector/ArrowTitle/Index
     * @demo Controls-demo/gridNew/Sorting/SortingSelector/SingleField/Index
     * @example
     * В опцию передается массив вида
     * <pre class="brush: js;">
     * _sortingParam: null,
     * _beforeMount: function(options) {
     *    this._sortingParam = [
     *       {
     *          paramName: 'FirstParam',
     *          title: 'По первому параметру'
     *       },
     *       {
     *          paramName: 'SecondParam',
     *          title: 'По второму параметру'
     *       }
     *    ]
     * }
     * </pre>
     *
     * Чтобы дать возможность сброса сортировки, нужно добавить пункт со значением paramName = null.
     *
     *
     * <pre class="brush: js; highlight: [5]">
     * _sortingParam: null,
     * _beforeMount: function(options) {
     *    this._sortingParam = [
     *       {
     *          paramName: null,
     *          title: 'По умолчанию'
     *       },
     *       {
     *          paramName: 'Name',
     *          title: 'По имени'
     *       }
     *    ]
     * }
     * </pre>
     *
     * Чтобы отобразить иконки в выпадающем списке, нужно задать поля icon и iconSize.
     * Выпадающий элемент так же отобразится в виде иконки
     *
     *
     * <pre class="brush: js; highlight: [5]">
     * _sortingParam: null,
     * _beforeMount: function(options) {
     *    this._sortingParam = [
     *       {
     *          paramName: null,
     *          title: 'По умолчанию',
     *          icon: 'icon-Attach',
     *          iconSize: 's'
     *       },
     *       {
     *          paramName: 'Name',
     *          title: 'По имени',
     *          icon: 'icon-1c',
     *          iconSize: 's'
     *       }
     *    ]
     * }
     * </pre>
     */
    sortingParams: ISortingParam[];
    /**
     * @name Controls/_sorting/interface/ISortingSelector#value
     * @cfg {Array.<Object>} Конфигурация сортировки.
     * @remark Если нет возможности сброса сортировки, то опция value должна содержать данные для сортировки.
     * @example
     * <pre class="brush: js;">
     * _sortingValue: null,
     * _sortingParam: null,
     * _beforeMount: function(options) {
     *    this._sortingParam = [
     *       {
     *          paramName: 'Name',
     *          title: 'По имени'
     *       },
     *       {
     *          paramName: 'Surname',
     *          title: 'По фамилии'
     *       }
     *    ]
     *    this._sortingValue = [
     *       {
     *          Name: 'DESC'
     *       }
     *    ];
     * }
     * </pre>
     *
     * Следует использовать директиву bind для опции value.
     *
     * <pre class="brush: html; highlight: [2,4]">
     * <Controls.sorting:Selector
     *   bind:value="_sortingValue"
     *   sortingParams="{{_sortingParam}}" />
     * </pre>
     */
    value: [object];
    /**
     * @name Controls/_sorting/interface/ISortingSelector#header
     * @cfg {String} Заголовок для выпадающего списка сортировки.
     * @remark Если заголовок не требуется, опцию можно не указывать.
     * @demo Controls-demo/gridNew/Sorting/SortingSelector/SortingSelectorWithHeader/Index
     */
    header: string;
    /**
     * @name Controls/_sorting/interface/ISortingSelector#viewMode
     * @cfg {String} Режим отображения кнопки.
     * @variant linkButton В виде кнопки-ссылки.
     * @variant toolButton В виде кнопки для панели инструментов с круглым ховером.
     * @default linkButton
     * @demo Controls-demo/gridNew/Sorting/SortingSelector/ViewMode/Index
     */
    viewMode: IViewMode;
    /**
     * @name Controls/_sorting/interface/ISortingSelector#iconSize
     * @cfg {Controls/interface/TIconSize.typedef} Размер иконки кнопки.
     * @remark Не влияет на размер иконок в меню, их размер настраивается опцией {@link menuIconSize}.
     * @demo Controls-demo/gridNew/Sorting/SortingSelector/IconSize/Index
     * @see menuIconSize
     */
    iconSize: TIconSize;
    /**
     * @name Controls/_sorting/interface/ISortingSelector#menuIconSize
     * @cfg {Controls/_sorting/interface/ISortingSelector/TMenuIconSize.typedef} Размер иконок в меню.
     * @default m
     * @demo Controls-demo/gridNew/Sorting/SortingSelector/IconSize/Index
     * @see iconSize
     */
    menuIconSize: TMenuIconSize;
}

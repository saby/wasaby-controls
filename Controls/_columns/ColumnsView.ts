/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
/**
 * Списочный контрол, который позволяет расположить записи в нескольких столбцах в зависимости от доступной ширины.
 *
 * @remark
 * Переменные тем оформления:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_columns.less набор переменных columns}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less набор переменных list}
 *
 * @class Controls/columns:View
 * @extends UI/Base:Control
 * @implements Controls/list:IListNavigation
 * @implements Controls/interface:ISource
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/list:IEditableList
 * @implements Controls/interface:ISorting
 * @implements Controls/interface:IDraggable
 * @implements Controls/interface/IGroupedList
 * @implements Controls/list:IClickableView
 * @implements Controls/list:IReloadableList
 * @implements Controls/list:IMovableList
 * @implements Controls/list:IRemovableList
 * @implements Controls/list:IVirtualScroll
 * @implements Controls/marker:IMarkerList
 * @implements Controls/interface:ITagStyle
 * @implements Controls/_columns/interface/IColumnsView
 * @public
 * @example
 * Пример базовой конфигурации:
 * <pre class="brush: html;">
 * <Controls.columns:View
 *     keyProperty="id"
 *     source="{{_viewSource}}" />
 * </pre>
 * @demo Controls-demo/list_new/ColumnsView/Default/Index
 */

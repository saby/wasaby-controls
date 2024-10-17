/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { Logger } from 'UI/Utils';
import { CrudEntityKey } from 'Types/source';
import { IItemsViewOptions } from 'Controls/baseList';
import { isFullGridSupport } from 'Controls/display';
import { ItemsView as ItemsGrid } from 'Controls/grid';
import { TreeGridControl } from './TreeGridControl';
import TreeGridView from 'Controls/_treeGrid/TreeGridView';
import TreeGridViewTable from 'Controls/_treeGrid/TreeGridViewTable';
import { IOptions as ITreeGridOptions } from 'Controls/_treeGrid/interface/ITreeGrid';
import { BaseTreeControlComponent } from 'Controls/baseTree';

/**
 * Опции для контрола {@link Controls/treeGrid:ItemsView}
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface IItemsTreeGridOptions extends IItemsViewOptions, ITreeGridOptions {}

/**
 * Контрол древовидной {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/ таблицы}, который умеет работать без {@link /doc/platform/developmentapl/interface-development/controls/list/source/ источника данных}.
 * В качестве данных ожидает {@link Types/collection:RecordSet} переданный в опцию {@link Controls/list:IItemsView#items items}.
 *
 * @demo Controls-demo/treeGridNew/ItemsView/Base/Index
 *
 * @class Controls/treeGrid:ItemsView
 * @extends Controls/grid:ItemsView
 * @implements Controls/list:IItemsView
 * @implements Controls/list:IVirtualScroll
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/list:IClickableView
 * @implements Controls/interface/IGridItemTemplate
 * @implements Controls/interface/IGroupedGrid
 * @implements Controls/interface/IGridItemTemplate
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface/IGroupedList
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/marker:IMarkerList
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/grid:IGridControl
 * @implements Controls/tree:ITree
 * @implements Controls/_interface/ITrackedProperties
 *
 * @ignoreOptions sourceController deepReload source expanderVisibility
 *
 * @public
 */
export default class ItemsTreeGrid extends ItemsGrid<IItemsTreeGridOptions, TreeGridControl> {
    protected _compatibilityWrapper = BaseTreeControlComponent;

    // region override base template props
    protected _viewName: Function = null;
    protected _viewTemplate: Function = TreeGridControl;
    protected _viewModelConstructor: string = 'Controls/treeGrid:TreeGridCollection';
    // endregion

    // region implement ITreeGrid
    readonly '[Controls/_treeGrid/interface/ITreeGrid]': true;
    // endregion

    // region life circle hooks
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    protected _beforeMount(
        options: IItemsTreeGridOptions,
        ...args: unknown[]
    ): ReturnType<ItemsGrid['_beforeMount']> {
        const superArgs = [options, ...args] as unknown as Parameters<ItemsGrid['_beforeMount']>;
        if (options.groupProperty && options.nodeTypeProperty) {
            Logger.error(
                'Нельзя одновременно задавать группировку через ' +
                    'groupProperty и через nodeTypeProperty.',
                this
            );
        }

        return super._beforeMount(...superArgs);
    }
    // endregion

    protected _getWasabyView() {
        return isFullGridSupport() ? TreeGridView : TreeGridViewTable;
    }

    // region proxy methods to list control
    toggleExpanded(key: CrudEntityKey): void {
        this._listControl.toggleExpanded(key).then();
    }
    goToPrev(): Model {
        return this._children.listControl.goToPrev();
    }
    goToNext(): Model {
        return this._children.listControl.goToNext();
    }
    // endregion
}

/**
 * Режим отображения {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/node/expander/ кнопки разворота узла} в {@link Controls/tree:View дереве}.
 * @remark
 * По умолчанию при видимой кнопке разворота узла в подвал, итоги, и шапку таблицы добавляется отступ, позволяющий отобразить содержимое на одоной вертикаоьной линии.
 * Для того, чтобы убрать этот отступ, необходимо в опциях шаблона подвала, итогов, или шапки передать параметр withoutExpanderPadding и присвоить ему значение true.
 * @name Controls/treeGrid:ItemsView#expanderVisibility
 * @cfg {Controls/_baseTree/interface/ITree/ExpanderVisibility.typedef}
 * @default visible
 * @demo Controls-demo/treeGridNew/Expander/Node/Index В следующем примере для контрола опция expanderVisibility установлена в значение visible.
 * @demo Controls-demo/treeGridNew/Expander/ExpanderVisibility/HasChildren/Index В следующем примере для контрола опция expanderVisibility установлена в значение hasChildren.
 * @see expanderIcon
 * @see expanderSize
 */

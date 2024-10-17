/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { Logger } from 'UI/Utils';
import { IItemsViewOptions, ItemsView, TItemsViewReceivedState } from 'Controls/baseList';
import TreeControl from 'Controls/_tree/TreeControl';
import { ITree, ITreeOptions, BaseTreeControlComponent } from 'Controls/baseTree';
import TreeView from 'Controls/_tree/TreeView';
import { CrudEntityKey } from 'Types/source';

/**
 * Опции для контрола {@link Controls/tree:ItemsView}
 *
 * @public
 */
export interface IItemsTreeOptions extends IItemsViewOptions, ITreeOptions {}

/**
 * Контрол древовидной таблицы, который умеет работать без источника данных.
 * В качестве данных ожидает {@link Types/collection:RecordSet}, переданный в опцию {@link Controls/list:IItemsView#items items}.
 * @class Controls/tree:ItemsView
 * @extends Controls/list:ItemsView
 * @implements Controls/list:IItemsView
 *
 * @ignoreOptions sourceController deepReload source
 *
 * @public
 */
export default class ItemsTree extends ItemsView<IItemsTreeOptions, TreeControl> implements ITree {
    protected _compatibilityWrapper = BaseTreeControlComponent;

    // region override base template props
    protected _viewName: Function = TreeView;
    protected _viewTemplate: Function = TreeControl;
    protected _viewModelConstructor: string = 'Controls/tree:TreeCollection';
    // endregion

    // region implement ITree
    readonly '[Controls/_baseTree/interface/ITree]': true;
    // endregion

    // region life circle hooks
    protected _beforeMount(
        options: ITreeOptions,
        context?: object,
        receivedState?: TItemsViewReceivedState
    ): TItemsViewReceivedState {
        if (options.groupProperty && options.nodeTypeProperty) {
            Logger.error(
                'Нельзя одновременно задавать группировку через ' +
                    'groupProperty и через nodeTypeProperty.',
                this
            );
        }

        return super._beforeMount(options, context, receivedState);
    }

    toggleExpanded(key: CrudEntityKey): Promise<void> {
        return this._listControl.toggleExpanded(key).then();
    }
    // endregion
}

/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { View as Grid } from 'Controls/grid';
import { TemplateFunction } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { CrudEntityKey } from 'Types/source';
import TreeGridView from 'Controls/_treeGrid/TreeGridView';
import TreeGridViewTable from 'Controls/_treeGrid/TreeGridViewTable';
import { TreeGridControl } from './TreeGridControl';
import { Model } from 'Types/entity';
import { isFullGridSupport } from 'Controls/display';
import ITreeGrid, { IOptions as ITreeGridOptions } from 'Controls/_treeGrid/interface/ITreeGrid';
import { TKey } from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import 'css!Controls/grid';
import 'css!Controls/baseTree';

/**
 * Контрол "Дерево с колонками" позволяет отображать данные из различных источников в виде иерархического списка.
 * Контрол поддерживает широкий набор возможностей, позволяющих разработчику максимально гибко настраивать отображение данных.
 * @remark
 * Дополнительно о контроле:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/ руководство разработчика}
 * * {@link http://axure.tensor.ru/StandardsV8/%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%D0%BE.html Спецификация Axure}
 * * {@link /materials/DemoStand/app/Controls-demo%2FList%2FTree%2FTreeWithPhoto демо-пример с пользовательским шаблоном элемента списка с фото}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_treeGrid.less переменные тем оформления treeGrid}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less переменные тем оформления list}
 *
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IStoreId
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface/IGroupedGrid
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:IHierarchy
 * @implements Controls/marker:IMarkerList
 * @implements Controls/interface/ITreeGridItemTemplate
 * @implements Controls/interface:IDraggable
 * @implements Controls/list:IVirtualScroll
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/list:IClickableView
 * @implements Controls/grid:IPropStorage
 * @implements Controls/tree:ITree
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/_treeGrid/interface/ITreeGrid
 * @implements Controls/error:IErrorControllerOptions
 *
 * @public
 * @demo Controls-demo/treeGridNew/Base/TreeGridView/Index
 */
export default class TreeGrid extends Grid<TreeGridControl> implements ITreeGrid {
    protected _viewName: TemplateFunction = null;
    protected _viewTemplate: TemplateFunction = TreeGridControl;
    protected _children: { listControl: TreeGridControl };

    _beforeMount(options: ITreeGridOptions): Promise<void> | void {
        if (options.groupProperty && options.nodeTypeProperty) {
            Logger.error(
                'Нельзя одновременно задавать группировку через ' +
                    'groupProperty и через nodeTypeProperty.',
                this
            );
        }

        if (!options.nodeProperty && !options.storeId) {
            Logger.error(
                'Не задана опция nodeProperty, обязательная для работы Controls/treeGrid:View',
                this
            );
        }

        if (!options.parentProperty && !options.storeId) {
            Logger.error(
                'Не задана опция parentProperty, обязательная для работы Controls/treeGrid:View',
                this
            );
        }

        return super._beforeMount(options);
    }

    protected _getWasabyView() {
        return isFullGridSupport() ? TreeGridView : TreeGridViewTable;
    }

    protected _getWasabyViewControl() {
        return TreeGridControl;
    }

    toggleExpanded(key: CrudEntityKey): Promise<void> {
        return this._children.listControl.toggleExpanded(key);
    }

    goToPrev(): Model {
        return this._children.listControl.goToPrev();
    }

    goToNext(): Model {
        return this._children.listControl.goToNext();
    }

    getMarkedNodeKey(): CrudEntityKey | null {
        return this._children.listControl.getMarkedNodeKey();
    }

    getNextItem(key: CrudEntityKey): Model {
        return this._children.listControl.getNextItem(key);
    }

    getPrevItem(key: CrudEntityKey): Model {
        return this._children.listControl.getPrevItem(key);
    }

    /**
     * Перезагружает указанные записи списка. Для этого отправляет запрос query-методом
     * со значением текущего фильтра в поле [parentProperty] которого передаются идентификаторы
     * родительских узлов.
     */
    reloadItems(ids: TKey[]): Promise<RecordSet | Error> {
        return this._children.listControl.reloadItems(ids);
    }

    protected _getModelConstructor(): string {
        return 'Controls/treeGrid:TreeGridCollection';
    }
}

/**
 * Загружает модель из {@link /doc/platform/developmentapl/interface-development/controls/list/source/ источника данных},
 * объединяет изменения в текущих данных и отображает элемент.
 * @name Controls/_treeGrid/TreeGrid#reloadItem
 * @function
 * @param {String|Number} key Идентификатор элемента коллекции, который должен быть перезагружен из источника.
 * @param {Controls/_list/interface/IReloadItemOptions} options настройки перезагрузки итема.
 * @remark Возвращаемый результат зависит от указанного в options значения {@link Controls/_list/interface/IReloadItemOptions#method method}.
 * При значении 'read' возвращается запрошенная запись, а при значении 'query' возвращается RecordSet с дочерними элементами для загруженного узла.
 * @returns {Promise<Model | RecordSet>} В случае успешной загрузки возвращается запрошенная запись или RecordSet с дочерними элементами для загруженного узла.
 * @see Controls/_list/interface/IReloadItemOptions#hierarchyReload
 */

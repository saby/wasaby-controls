/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { TemplateFunction } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { descriptor } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import { Model } from 'Types/entity';

import { View as List } from 'Controls/baseList';
import TreeControl from 'Controls/_tree/TreeControl';
import { ITree, ITreeOptions } from 'Controls/baseTree';
import TreeView from 'Controls/_tree/TreeView';

import 'css!Controls/baseTree';

/**
 * Контрол "Дерево без колонок" позволяет отображать данные из различных источников в виде иерархического списка.
 * Контрол поддерживает широкий набор возможностей, позволяющих разработчику максимально гибко настраивать отображение данных.
 * @remark
 * Дополнительно о контроле:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tree/ руководство разработчика}
 *
 * @implements Controls/interface:ISource
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface/IGroupedGrid
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:IDraggable
 * @implements Controls/list:IVirtualScroll
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/list:IClickableView
 * @implements Controls/grid:IPropStorage
 * @implements Controls/tree:ITree
 * @implements Controls/itemActions:IItemActions
 *
 * @public
 */
export default class Tree extends List implements ITree {
    protected _viewName: TemplateFunction = TreeView;
    protected _viewTemplate: TemplateFunction = TreeControl;

    _beforeMount(options: ITreeOptions): Promise<void> {
        if (!options.nodeProperty && !options.storeId) {
            Logger.error(
                'Не задана опция nodeProperty, обязательная для работы Controls/tree:View',
                this
            );
        }

        if (!options.parentProperty && !options.storeId) {
            Logger.error(
                'Не задана опция parentProperty, обязательная для работы Controls/tree:View',
                this
            );
        }

        return super._beforeMount(options);
    }

    toggleExpanded(key: CrudEntityKey): Promise<void> {
        // @ts-ignore
        return this._children.listControl.toggleExpanded(key);
    }

    goToPrev(): Model {
        return this._children.listControl.goToPrev();
    }

    goToNext(): Model {
        return this._children.listControl.goToNext();
    }

    getNextItem(key: CrudEntityKey): Model {
        return this._children.listControl.getNextItem(key);
    }

    getPrevItem(key: CrudEntityKey): Model {
        return this._children.listControl.getPrevItem(key);
    }

    getMarkedNodeKey(): CrudEntityKey | null {
        return this._children.listControl.getMarkedNodeKey();
    }

    protected _getModelConstructor(): string {
        return 'Controls/tree:TreeCollection';
    }
}

/**
 * @name Controls/_tree/Tree#itemTemplate
 * @cfg {TemplateFunction|String} Шаблон элемента списка.
 * @remark
 * По умолчанию используется шаблон "{@link Controls/tree:ItemTemplate Controls/tree:ItemTemplate}".
 *
 * Базовый шаблон itemTemplate поддерживает следующие параметры:
 * - contentTemplate {Function} — Шаблон содержимого элемента;
 * - highlightOnHover {Boolean} — Выделять элемент при наведении на него курсора мыши.
 * - cursor {TCursor} — Устанавливает вид {@link https://developer.mozilla.org/ru/docs/Web/CSS/cursor курсора мыши} при наведении на строку.
 *
 * В области видимости шаблона доступен объект item, позволяющий получить доступ к данным рендеринга (например, элемент, ключ и т.д.).
 * Подробнее о работе с шаблоном читайте в <a href="/doc/platform/developmentapl/interface-development/controls/list/tree/item/">руководстве разработчика</a>.
 * @remark
 * Чтобы отобразить чекбоксы в режиме "только для чтения" воспользуйтесь опцией списка {@link Controls/_list/interface/IList#multiSelectAccessibilityProperty multiSelectAccessibilityProperty}
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.tree:View keyProperty="key"
 *                     source="{{_viewSource}}"
 *                     parentProperty="parent"
 *                     multiSelectVisibility="visible"
 *                     nodeProperty="type">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/tree:ItemTemplate" scope="{{itemTemplate}}">
 *          <ws:contentTemplate>
 *             <span>{{contentTemplate.item.contents.description}}</span>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.tree:View>
 * </pre>
 * @see Controls/tree:ItemTemplate
 * @see Controls/_list/interface/IList#multiSelectAccessibilityProperty
 */

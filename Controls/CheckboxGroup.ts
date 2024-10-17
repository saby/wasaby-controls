/**
 * @kaizen_zone 204ec3b3-2a04-40a4-96b9-ae50b5d671b2
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_CheckboxGroup/CheckboxGroup');
import groupTemplate = require('wml!Controls/_CheckboxGroup/GroupTemplate');
import defaultItemTemplate = require('wml!Controls/_CheckboxGroup/resources/ItemTemplate');
import { CrudWrapper } from 'Controls/dataSource';
import { isEqual } from 'Types/object';
import { descriptor as EntityDescriptor, Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import {
    ISource,
    ISourceOptions,
    IMultiSelectable,
    TSelectedKey,
    IMultiSelectableOptions,
    IHierarchy,
    IHierarchyOptions,
    IToggleGroup,
    IToggleGroupOptions,
    IResetValueOptions,
    IContrastBackgroundOptions,
    IValidationStatusOptions,
    IItemsOptions,
} from 'Controls/interface';
import 'css!Controls/CheckboxGroup';

export interface ICheckboxGroupOptions
    extends IControlOptions,
        IMultiSelectableOptions,
        IHierarchyOptions,
        ISourceOptions,
        IItemsOptions<object>,
        IToggleGroupOptions,
        IResetValueOptions,
        IContrastBackgroundOptions,
        IValidationStatusOptions {
    direction?: string;
}

/**
 * Группа контролов, которые предоставляют пользователям возможность выбора из двумя или более параметров.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_toggle.less переменные тем оформления}
 *
 * @class Controls/CheckboxGroup:Control
 * @extends UI/Base:Control
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IItems
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:IToggleGroup
 * @implements Controls/interface:IValidationStatus
 * @ignoreOptions dataLoadCallback
 * @ignoreOptions dataLoadErrback
 *
 * @public
 * @demo Controls-demo/toggle/CheckboxGroup/Base/Index
 */

/*
 * Controls are designed to give users a multichoice among two or more settings.
 *
 * @class Controls/CheckboxGroup
 * @extends UI/Base:Control
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:IToggleGroup
 *
 * @public
 * @author Мочалов М.А.
 * @demo Controls-demo/toggle/CheckboxGroup/Base/Index
 */
class CheckboxGroup
    extends Control<ICheckboxGroupOptions, RecordSet>
    implements ISource, IMultiSelectable, IHierarchy, IToggleGroup
{
    '[Controls/_interface/ISource]': boolean = true;
    '[Controls/_interface/IMultiSelectable]': boolean = true;
    '[Controls/_interface/IHierarchy]': boolean = true;
    '[Controls/_interface/IToggleGroup]': boolean = true;

    protected _template: TemplateFunction = template;
    protected _groupTemplate: Function = groupTemplate;
    protected _defaultItemTemplate: Function = defaultItemTemplate;
    protected _items: RecordSet;
    protected _crudWrapper: CrudWrapper;
    protected _selectedKeys: TSelectedKey[] = [];
    protected _triStateKeys: string[] = [];
    protected _groups: object = {};

    protected _beforeMount(
        options: ICheckboxGroupOptions,
        context: object,
        receivedState: RecordSet
    ): void | Promise<RecordSet> {
        this._isSelected = this._isSelected.bind(this);
        if (receivedState) {
            this._prepareItems(options, receivedState);
        } else if (options.source) {
            return this._initItems(options);
        } else {
            this._prepareItems(options, options.items);
        }
    }

    protected _beforeUpdate(newOptions: ICheckboxGroupOptions): void {
        if (newOptions.items !== this._options.items && !newOptions.source) {
            this._prepareItems(newOptions, newOptions.items);
        }
        if (newOptions.source && newOptions.source !== this._options.source) {
            this._initItems(newOptions).then(() => {
                // eslint-disable-next-line
                this._forceUpdate();
            });
        }
        if (newOptions.selectedKeys && !isEqual(this._selectedKeys, newOptions.selectedKeys)) {
            this._prepareSelected(newOptions);
        }
    }

    private _initItems(options: ICheckboxGroupOptions): Promise<RecordSet> {
        this._crudWrapper = new CrudWrapper({
            source: options.source,
        });
        return this._crudWrapper.query({}).then((items) => {
            this._prepareItems(options, items);
            return items;
        });
    }

    private _prepareItems(options: ICheckboxGroupOptions, items: RecordSet): void {
        this._items = items;
        this.sortGroup(options, items);
        this._prepareSelected(options);
    }

    private sortGroup(options: ICheckboxGroupOptions, items: RecordSet): void {
        this._groups = {};
        items.each((item) => {
            const parent = options.parentProperty ? item.get(options.parentProperty) : null;
            if (!this._groups[parent]) {
                this._groups[parent] = [];
            }
            this._groups[parent].push(item);
        });
    }

    private _prepareSelected(options: ICheckboxGroupOptions): void {
        this._selectedKeys = options.selectedKeys ? [...options.selectedKeys] : [];
        this._triStateKeys = [];
        if (options.parentProperty) {
            this._items.each((item) => {
                this._setItemsSelection(item, options);
            });
        }
    }

    private _isSelected(item: Record): boolean | null {
        if (this._selectedKeys.indexOf(this._getItemKey(item, this._options)) > -1) {
            return true;
        }
        if (this._triStateKeys.indexOf(this._getItemKey(item, this._options)) > -1) {
            return null;
        }
        return false;
    }

    private _addKey(key: string, options: ICheckboxGroupOptions = this._options): void {
        this._removeTriStateKey(key);
        const item = this._items?.getRecordById(key);
        if (this._selectedKeys.indexOf(key) < 0 && !item?.get('readOnly')) {
            this._selectedKeys = [...this._selectedKeys];
            this._selectedKeys.push(key);
            this._updateItemChildSelection(key, true, options);
        }
    }

    private _addTriStateKey(key: string): void {
        if (this._triStateKeys.indexOf(key) < 0) {
            this._triStateKeys.push(key);
        }
    }

    private _removeTriStateKey(key: string): void {
        const index = this._triStateKeys.indexOf(key);
        if (index > -1) {
            this._triStateKeys.splice(index, 1);
        }
    }

    private _removeKey(key: string): void {
        this._removeTriStateKey(key);
        const index = this._selectedKeys.indexOf(key);
        const item = this._items?.getRecordById(key);
        if (index > -1 && !item?.get('readOnly')) {
            this._selectedKeys = [...this._selectedKeys];
            this._selectedKeys.splice(index, 1);
        }
    }

    private _updateItemChildSelection(
        itemKey: string,
        value: boolean | null,
        options: ICheckboxGroupOptions = this._options
    ): void {
        const child = this._groups[itemKey];
        if (child) {
            child.map((childItem) => {
                const childKey = childItem.get(options.keyProperty);
                if (value) {
                    this._addKey(childKey, options);
                } else {
                    this._removeKey(childKey);
                    this._updateItemChildSelection(childKey, false, options);
                }
            });
        }
        const item = this._items.getRecordById(itemKey);
        const parentId = item.get(options.parentProperty);
        if (parentId) {
            const parent = this._items.getRecordById(parentId);
            this._removeKey(parentId);
            this._setItemsSelection(parent, options);
        }
    }

    private _setItemsSelection(item: Record, options: ICheckboxGroupOptions): boolean | null {
        const itemKey = this._getItemKey(item, options);
        const isItemInSelectedKeys = this._selectedKeys.indexOf(itemKey) > -1;
        if (isItemInSelectedKeys) {
            return true;
        }
        const parentId = item.get(options.parentProperty);
        if (parentId) {
            const parent = this._items.getRecordById(parentId);
            const isParentSelected =
                this._selectedKeys.indexOf(this._getItemKey(parent, options)) > -1;
            if (isParentSelected) {
                this._addKey(itemKey, options);
                return true;
            }
        }

        if (item.get(options.nodeProperty)) {
            let hasSelectedChild = null;
            let hasUnselectedChild = null;
            const child = this._groups[this._getItemKey(item, options)];
            child.map((childItem) => {
                if (this._setItemsSelection(childItem, options)) {
                    hasSelectedChild = true;
                } else {
                    hasUnselectedChild = true;
                }
            });
            if (hasSelectedChild && hasUnselectedChild === null) {
                this._addKey(itemKey, options);
                if (parentId) {
                    const parent = this._items.getRecordById(parentId);
                    this._setItemsSelection(parent, options);
                }
                return true;
            }
            if (hasSelectedChild && hasUnselectedChild) {
                this._addTriStateKey(itemKey);
                return null;
            }
        }
        return false;
    }

    private _getItemKey(item: Record, options: ICheckboxGroupOptions): string {
        return item.get(options.keyProperty);
    }

    protected _getCorrectValue(itemKey: string, value: boolean | null): boolean | null {
        const child = this._groups[itemKey];
        if (child) {
            for (let i = 0; i < child.length; i++) {
                if (child[i].get('readOnly')) {
                    continue;
                }
                if (this._isSelected(child[i])) {
                    return false;
                }
            }
            return true;
        }
        return value;
    }

    protected _valueChangedHandler(e: Event, item: Record, value: boolean | null): void {
        const key = this._getItemKey(item, this._options);
        const corValue = this._getCorrectValue(key, value);
        if (corValue) {
            this._addKey(key, this._options);
            this._notifySelectedKeys(key);
        } else {
            this._removeKey(key);
            this._updateItemChildSelection(key, false, this._options);
            this._notifySelectedKeys(undefined, key);
        }
    }

    private _notifySelectedKeys(added?: string, deleted?: string): void {
        this._notify('selectedKeysChanged', [this._selectedKeys, added, deleted]);
    }

    static getDefaultOptions(): object {
        return {
            direction: 'vertical',
            keyProperty: 'id',
            itemTemplate: defaultItemTemplate,
            validationStatus: 'valid',
        };
    }

    static getOptionTypes(): object {
        return {
            direction: EntityDescriptor(String),
            keyProperty: EntityDescriptor(String),
            items: EntityDescriptor(RecordSet),
        };
    }
}

export { CheckboxGroup as Control, defaultItemTemplate };

/**
 * @name Controls/CheckboxGroup:Control#itemTemplate
 * @cfg {TemplateFunction}
 * @demo Controls-demo/toggle/CheckboxGroup/ItemTemplate/Index
 * @example
 * CheckboxGroup с itemTemplate и contentTemplate.
 * <pre>
 *    <Controls.CheckboxGroup:Control ... >
 *       <ws:itemTemplate>
 *          <ws:partial
 *             template="Controls/CheckboxGroup:defaultItemTemplate">
 *             <ws:contentTemplate>
 *                <div>
 *                 <div class="controls-fontsize-l controls-text-{{itemTemplate.selected ? 'warning' : 'readonly'}}">
 *                      {{itemTemplate.item.title}}
 *                  </div>
 *                  <p class="contract-radio__type__text">
 *                      {{itemTemplate.item.text}}
 *                  </p>
 *                </div>
 *             </ws:contentTemplate>
 *          </ws:partial>
 *       </ws:itemTemplate>
 *    </Controls.CheckboxGroup:Control>
 * </pre>
 */

/**
 * @name Controls/CheckboxGroup:Control#itemTemplateProperty
 * @cfg {String}
 * @demo Controls-demo/toggle/CheckboxGroup/ItemTemplateProperty/Index
 */

/**
 * @name Controls/CheckboxGroup:Control#validationStatus
 * @cfg {Controls/interface:IValidationStatus}
 * @demo Controls-demo/toggle/CheckboxGroup/validationStatus/Index
 */

/**
 * @name Controls/CheckboxGroup:Control#keyProperty
 * @cfg {String}
 * @default id
 */

/**
 * @name Controls/CheckboxGroup:Control#displayProperty
 * @cfg {String} Имя поля элемента, значение которого будет отображаться в названии кнопок тумблера.
 *
 * @example
 * Пример описания.
 * <pre>
 *    <Controls.CheckboxGroup:Control displayProperty="caption"
 *                                   items="{{_items1}}"
 *                                   bind:selectedKey="_selectedKey1"/>
 * </pre>
 *
 * <pre>
 *   new RecordSet({
 *       keyProperty: 'key',
 *       rawData: [
 *           {
 *               key: 1,
 *               title: 'title 1',
 *               caption: 'caption 1'
 *           },
 *           {
 *               key: 2,
 *               title: 'title 2',
 *               caption: 'caption 2'
 *           },
 *           {
 *               key: 3,
 *               title: 'title 3',
 *               caption: 'caption 3'
 *           }
 *       ]
 *   });
 * </pre>
 * @default title
 *
 * @demo Controls-demo/toggle/CheckboxGroup/displayProperty/Index
 */

/**
 * @name Controls/CheckboxGroup:Control#parentProperty
 * @cfg {String}
 * @demo Controls-demo/toggle/CheckboxGroup/ParentProperty/Index
 */

/**
 * @name Controls/CheckboxGroup:Control#source
 * @cfg {Types/source:ICrud}
 * @demo Controls-demo/toggle/CheckboxGroup/Source/Index
 */

/**
 * @name Controls/CheckboxGroup:Control#items
 * @cfg {Types/collection:RecordSet}
 * @example
 * Пример где 1 элемент находится в состоянии на чтение
 * <pre class="brush: html">
 *  <Controls.CheckboxGroup:Control items="{{_items}}"
 *      bind:selectedKeys="_selectedKeys"
 *      keyProperty="key"/>
 * </pre>
 * <pre class="brush: js">
 *     class MyControl extends Control<IControlOptions>{
 *       ...
 *       _beforeMount() {
 *          this._items = new RecordSet({
 *                keyProperty: 'key',
 *                rawData: [
 *                    {
 *                        key: 1,
 *                        title: 'First option'
 *                    },
 *                    {
 *                        key: 2,
 *                        title: 'Second option',
 *                        readOnly: true
 *                    },
 *                    {
 *                        key: 3,
 *                        title: 'Third option'
 *                    }
 *                ]
 *          });
 *       }
 *       ...
 *   }
 * </pre>
 * @demo Controls-demo/toggle/CheckboxGroup/Items/Index
 */

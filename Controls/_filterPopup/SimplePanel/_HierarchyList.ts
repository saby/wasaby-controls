/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import template = require('wml!Controls/_filterPopup/SimplePanel/_HierarchyList/HierarchyList');
import { factory } from 'Types/chain';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { SyntheticEvent } from 'UICommon/Events';
import emptyItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/_List/emptyItemTemplate');
import hierarchyItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/_HierarchyList/hierarchyItemTemplate');
import * as DropdownViewModel from 'Controls/_filterPopup/SimplePanel/DropdownViewModel';
import 'css!Controls/filterPopup';

interface IHierarchyListFolder {
    [key: string]: Model;
}

interface IHierarchyListKeys {
    [key: string]: string[];
}

class HierarchyList extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _folders: IHierarchyListFolder = null;
    protected _selectedKeys: IHierarchyListKeys = null;
    protected _flatSelectedKeys: string[] = [];
    protected _emptyItemTemplate: TemplateFunction = emptyItemTemplate;
    protected _selectionChanged: boolean = false;
    protected _listModel: typeof DropdownViewModel;

    _beforeMount(options: object) {
        this._folders = this._getFolders(
            options.selectorItems,
            options.nodeProperty
        );
        this._hasFolders = !!Object.keys(this._folders).length;
        if (this._hasFolders) {
            this._selectedKeys = this._getSelectedKeys(
                options.selectedKeys,
                this._folders,
                options.emptyKey
            );
            this._flatSelectedKeys = this._getViewModelSelectedKeys(
                this._selectedKeys,
                options.emptyKey
            );
            this._nodeItems = this._getNodeItems(this._folders, options);
        } else {
            this._selectedKeys = this._flatSelectedKeys = options.selectedKeys;
        }

        this._listModel = new DropdownViewModel({
            items: options.items,
            selectedKeys: this._flatSelectedKeys,
            keyProperty: options.keyProperty,
            itemTemplateProperty: options.itemTemplateProperty,
            displayProperty: options.displayProperty,
            emptyText: options.emptyText,
            emptyKey: options.emptyKey,
            hasApplyButton: options.hasApplyButton,
            hasClose: true,
        });
    }

    _hasMoreButton(folder: Model): boolean {
        return this._options.sourceController.hasMoreData(
            'down',
            folder.get(this._options.keyProperty)
        );
    }

    _itemClickHandler(
        event: SyntheticEvent,
        index: number,
        key: IHierarchyListKeys
    ) {
        if (this._selectionChanged) {
            this._checkBoxClickHandler(event, index, key);
        } else {
            if (this._hasFolders) {
                this._selectedKeys = {};
                this._selectedKeys[index] = key;
                this._notify('itemClick', [this._selectedKeys]);
            } else {
                this._notify('itemClick', [key]);
            }
        }
    }

    _emptyItemClickHandler() {
        this._selectedKeys = [this._options.emptyKey];
        this._notify('itemClick', [this._selectedKeys]);
    }

    _checkBoxClickHandler(
        event: SyntheticEvent,
        index: number,
        keys: IHierarchyListKeys
    ) {
        let eventName = 'checkBoxClick';
        const setKeys = () => {
            if (keys === undefined) {
                this._selectedKeys[index] = [];
            } else {
                this._selectedKeys[index] = keys;
            }
        };

        if (!!this._folders[keys[0]]) {
            this._clearSelectedKeys(this._folders, this._selectedKeys);
            eventName = 'itemClick';
        } else {
            this._selectionChanged = true;
            const currentFolderKey = this._folders[index].get(
                this._options.keyProperty
            );
            if (
                this._selectedKeys[index].includes(currentFolderKey) &&
                keys.length > 1
            ) {
                keys.splice(keys.indexOf(currentFolderKey), 1);
            }
        }
        setKeys();
        this._notify(eventName, [this._selectedKeys]);
        this._listModel.setSelectedKeys(
            this._getViewModelSelectedKeys(
                this._selectedKeys,
                this._options.emptyKey
            )
        );
    }

    _moreButtonClick() {
        this._notify('moreButtonClick');
    }

    private _getFolders(
        items: RecordSet,
        nodeProperty: string
    ): IHierarchyListFolder {
        const folders = {};
        factory(items).each((item) => {
            if (item.get(nodeProperty)) {
                folders[item.getKey()] = item;
            }
        });
        return folders;
    }

    private _getItemsByFolder(
        items: Model[],
        folderId: string,
        parentProperty: string
    ): Model[] {
        return factory(items)
            .filter((item) => {
                return item.get(parentProperty) === folderId;
            })
            .value();
    }

    private _getViewModelSelectedKeys(
        selectedKeys: IHierarchyListKeys,
        emptyKey: string
    ) {
        let result = [];
        factory(selectedKeys).each((key) => {
            if (!key.includes(emptyKey)) {
                result = result.concat(key);
            }
        });
        return result;
    }

    private _clearSelectedKeys(
        folders: IHierarchyListFolder,
        selectedKeys: IHierarchyListKeys
    ) {
        factory(folders).each((folder, index) => {
            selectedKeys[index] = [];
        });
    }

    private _getSelectedKeys(
        selectedKeys: IHierarchyListKeys,
        folders: IHierarchyListFolder,
        emptyKey: string
    ): IHierarchyListKeys {
        const clonedKeys = {};
        factory(folders).each((folder, index: string) => {
            if (
                selectedKeys[index] === undefined ||
                selectedKeys[index] === emptyKey
            ) {
                clonedKeys[index] = [];
            } else {
                clonedKeys[index] = selectedKeys[index];
            }
        });
        return clonedKeys;
    }

    private _getNodeItems(
        folders: IHierarchyListFolder,
        { items, keyProperty, parentProperty }: object
    ) {
        const nodeItems = {};
        factory(folders).each((folder, index) => {
            const records = new RecordSet({
                keyProperty,
                adapter: items.getAdapter(),
            });
            records.add(folder);
            records.append(
                this._getItemsByFolder(
                    items,
                    folder.get(keyProperty),
                    parentProperty
                )
            );
            nodeItems[index] = records;
        });
        return nodeItems;
    }

    static getDefaultOptions(): object {
        return {
            itemTemplate: hierarchyItemTemplate,
        };
    }
}

export = HierarchyList;

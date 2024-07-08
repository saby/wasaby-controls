/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import template = require('wml!Controls/_filterPopup/SimplePanel/_HierarchyList/HierarchyList');
import { factory } from 'Types/chain';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'UICommon/Events';
import emptyItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/_List/emptyItemTemplate');
import hierarchyItemTemplate = require('wml!Controls/_filterPopup/SimplePanel/_HierarchyList/hierarchyItemTemplate');
import 'css!Controls/filterPopup';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { IListPanelOptions } from 'Controls/_filterPopup/SimplePanel/_List';

interface IHierarchyListFolder {
    [key: string]: Model;
}

interface IHierarchyListKeys {
    [key: string]: string[];
}

class HierarchyList extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _folders: IHierarchyListFolder = null;
    protected _sourceControllers: { [key: string]: SourceController };
    protected _emptyItemSource: Memory;
    protected _selectedKeys: IHierarchyListKeys = null;
    protected _flatSelectedKeys: string[] = [];
    protected _emptyItemTemplate: TemplateFunction = emptyItemTemplate;
    protected _selectionChanged: boolean = false;

    _beforeMount(options: IListPanelOptions) {
        this._folders = this._getFolders(options);
        if (this._hasFolders()) {
            this._selectedKeys = this._getSelectedKeys(
                options.selectedKeys,
                this._folders,
                options.emptyKey
            );
            this._flatSelectedKeys = this._getViewModelSelectedKeys(
                this._selectedKeys,
                options.emptyKey
            );
            this._sourceControllers = this._getSourceControllers(this._folders, options);
            if (options.emptyText) {
                this._emptyItemSource = new Memory({
                    data: [],
                    keyProperty: options.keyProperty,
                });
            }
        } else {
            this._selectedKeys = this._flatSelectedKeys = options.selectedKeys;
            options.sourceController?.setParentProperty(options.parentProperty);
        }
    }

    _hasFolders(): boolean {
        return !!Object.keys(this._folders).length;
    }

    _hasMoreButton(folder: Model): boolean {
        return this._options.sourceController.hasMoreData(
            'down',
            folder.get(this._options.keyProperty)
        );
    }

    _itemClickHandler(event: SyntheticEvent, index: number, key: IHierarchyListKeys) {
        if (this._selectionChanged) {
            this._checkBoxClickHandler(event, index, key);
        } else {
            if (this._hasFolders()) {
                this._selectedKeys = {};
                this._selectedKeys[index] = key;
            }
            this._notify('itemClick', [this._selectedKeys]);
        }
    }

    _emptyItemClickHandler() {
        this._selectedKeys = [this._options.emptyKey];
        this._flatSelectedKeys = this._getViewModelSelectedKeys(
            this._selectedKeys,
            this._options.emptyKey
        );
        this._notify('itemClick', [this._selectedKeys]);
    }

    _checkBoxClickHandler(event: SyntheticEvent, index: number, keys: IHierarchyListKeys) {
        const setKeys = () => {
            if (keys === undefined) {
                this._selectedKeys[index] = [];
            } else {
                this._selectedKeys[index] = keys;
            }
        };

        if (!!this._folders[keys[0]]) {
            this._clearSelectedKeys(this._folders, this._selectedKeys);
        } else {
            this._selectionChanged = true;
            const currentFolderKey = this._folders[index]?.get(this._options.keyProperty);
            if (this._selectedKeys[index].includes(currentFolderKey) && keys.length > 1) {
                keys.splice(keys.indexOf(currentFolderKey), 1);
            }
        }
        setKeys();
        this._selectedKeys = { ...this._selectedKeys };
        this._flatSelectedKeys = this._getViewModelSelectedKeys(
            this._selectedKeys,
            this._options.emptyKey
        );
        this._notify('checkBoxClick', [this._selectedKeys]);
    }

    _moreButtonClick() {
        this._notify('moreButtonClick');
    }

    private _getFolders({ selectorItems, nodeProperty }: IListPanelOptions): IHierarchyListFolder {
        const folders = {};
        factory(selectorItems).each((item) => {
            if (item.get(nodeProperty)) {
                const folderItem = item.clone();
                folderItem.set('pinned', true); // отключаем множественный выбор
                folderItem.set(nodeProperty, false); // устанавливаем как скрытый узел
                folders[item.getKey()] = folderItem;
                this._firstKey = item.getKey();
            }
        });
        return folders;
    }

    private _getItemsByFolder(items: Model[], folderId: string, parentProperty: string): Model[] {
        return factory(items)
            .filter((item) => {
                return item.get(parentProperty) === folderId;
            })
            .value();
    }

    private _getViewModelSelectedKeys(selectedKeys: IHierarchyListKeys, emptyKey: string) {
        const result = Object.values(selectedKeys).flat();
        const emptyIndex = result.indexOf(emptyKey);
        if (emptyIndex !== -1) {
            result.splice(emptyIndex, 1);
        }

        return result;
    }

    private _clearSelectedKeys(folders: IHierarchyListFolder, selectedKeys: IHierarchyListKeys) {
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
            if (selectedKeys[index] === undefined || selectedKeys[index] === emptyKey) {
                clonedKeys[index] = [];
            } else {
                clonedKeys[index] = selectedKeys[index];
            }
        });
        return clonedKeys;
    }

    private _getSourceControllers(
        folders: IHierarchyListFolder,
        { items, keyProperty, parentProperty }: object
    ) {
        const sourceControllers = {};
        factory(folders).each((folder, index) => {
            const records = new RecordSet({
                keyProperty,
                adapter: items.getAdapter(),
            });
            records.add(folder);
            records.append(this._getItemsByFolder(items, folder.get(keyProperty), parentProperty));
            sourceControllers[index] = new SourceController({
                items: records,
                keyProperty,
                parentProperty,
            });
        });
        return sourceControllers;
    }

    static getDefaultOptions(): object {
        return {
            itemTemplate: hierarchyItemTemplate,
        };
    }
}

export = HierarchyList;

import { IData, IDecorator, QueryWhereExpression } from 'Types/source';
import { adapter as adapterLib } from 'Types/entity';
import * as cInstance from 'Core/core-instance';
import { ISelectionObject, TSelectionRecord, TSelectionType } from 'Controls/interface';
import { selectionToRecord } from 'Controls/operations';
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';
import { FilterResolver } from 'Controls/search';
import { IFilterOptions, IHierarchyOptions, TKey } from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import { object } from 'Types/util';
import { process } from 'Controls/error';
import { CrudWrapper } from 'Controls/dataSource';
import { Logger } from 'UI/Utils';
import { IListState } from 'Controls/dataFactory';

const SELECTION_TYPES = ['all', 'leaf', 'node'];

interface IFilterConfig extends IFilterOptions, IHierarchyOptions {
    selection: TSelectionRecord;
    root?: string | number | null;
    searchParam?: string;
    items: RecordSet;
    parentProperty?: string;
    nodeProperty?: string;
    selectionType: TSelectionType;
}

export default {
    getSourceAdapter(source: IData): adapterLib.IAdapter {
        let adapter: adapterLib.IAdapter;

        if (cInstance.instanceOfMixin(source, 'Types/_source/IDecorator', null)) {
            adapter = ((source as IDecorator).getOriginal() as IData).getAdapter();
        } else {
            adapter = source.getAdapter();
        }
        return adapter;
    },

    getSelection(
        selection: ISelectionObject,
        adapter: adapterLib.IAdapter,
        selectionType: TSelectionType,
        recursiveSelection: boolean
    ): TSelectionRecord {
        const type = this.getValidSelectionType(selectionType);
        return selectionToRecord(selection, adapter, type, recursiveSelection);
    },

    getValidSelectionType(selectionType: TSelectionType): TSelectionType {
        let type: TSelectionType;

        if (SELECTION_TYPES.indexOf(selectionType) !== -1) {
            type = selectionType;
        } else {
            type = 'all';
        }

        return type;
    },

    prepareFilter({
        filter,
        selection,
        searchParam,
        parentProperty,
        nodeProperty,
        root,
        items,
        selectionType,
    }: IFilterConfig): object {
        const selectedKeys = selection.get('marked');
        const currentRoot = root !== undefined ? root : null;
        let resultFilter = object.clone(filter);
        const hasSearchParamInFilter = searchParam && resultFilter[searchParam];
        const hasSelectNodes = this.hasSelectedNodes(items, selectedKeys, nodeProperty);

        // FIXME https://online.sbis.ru/opendoc.html?guid=e8bcc060-586f-4ca1-a1f9-1021749f99c2
        // TODO KINDO
        // При отметке всех записей в фильтре проставляется selection в виде:
        // marked: [null]
        // excluded: [null]
        // Если что-то поискать, отметить всё через панель массовых операций, и нажать "Выбрать"
        // то в фильтр необходимо посылать searchParam и selection, иначе выборка будет включать все записи,
        // даже которые не попали под фильтрацию при поиске.
        // Если просто отмечают записи чекбоксами (не через панель массовых операций),
        // то searchParam из фильтра надо удалять, т.к. записи могут отметить например в разных разделах,
        // и запрос с searchParam в фильтре вернёт не все записи, которые есть в selection'e.
        if (
            hasSearchParamInFilter &&
            ArrayUtil.invertTypeIndexOf(selectedKeys, currentRoot) === -1 &&
            (!hasSelectNodes || selectionType === 'node')
        ) {
            resultFilter = FilterResolver.getResetSearchFilter(
                resultFilter,
                searchParam,
                parentProperty,
                true,
                false
            );
        }
        if (parentProperty) {
            delete resultFilter[parentProperty];
        }
        /*
         FIXME: https://online.sbis.ru/opendoc.html?guid=239a4b17-5429-4179-9b72-d28a707bee0b
         Конфликт полей selection и selectionWithPath/entries, которые подмешиваются в фильтр
         для получения метаданных, которые при завершении выбора не нужны.
        */
        if (resultFilter?.entries) {
            delete resultFilter.entries;
        }
        if (resultFilter?.selectionWithPath) {
            delete resultFilter.selectionWithPath;
        }
        resultFilter.selection = selection;
        return resultFilter;
    },

    hasSelectedNodes(items: RecordSet, selectedKeys: TKey[], nodeProperty: string): boolean {
        let hasSelectedNodes = false;

        if (nodeProperty && items) {
            let selectedItem;
            selectedKeys.forEach((key) => {
                selectedItem = items.getRecordById(key);

                if (selectedItem && !hasSelectedNodes) {
                    hasSelectedNodes = selectedItem.get(nodeProperty);
                }
            });
        }

        return hasSelectedNodes;
    },

    loadSelectedItems(
        filter: QueryWhereExpression<unknown>,
        listConfig: IListState,
        multiSelect: boolean
    ): Promise<RecordSet | undefined> {
        const { items, sorting, source, nodeProperty, selectedKeys, excludedKeys, selectFields } =
            listConfig;
        let loadItemsPromise;

        if (selectedKeys?.length || excludedKeys?.length) {
            if (!multiSelect) {
                const selectedItems = this.getEmptyItems(items);

                selectedItems.add(items?.getRecordById(selectedKeys[0]));
                loadItemsPromise = Promise.resolve(selectedItems);
            } else {
                if (source) {
                    loadItemsPromise = new CrudWrapper({ source })
                        .query({
                            filter,
                            sorting,
                            select: selectFields,
                        })
                        .then((rs) => {
                            const isNodeSelected =
                                selectedKeys?.length === 1 &&
                                this.hasSelectedNodes(items, selectedKeys, nodeProperty);
                            if (
                                !rs.getCount() &&
                                items?.getCount() &&
                                source['[Types/_source/SbisService]'] &&
                                (!isNodeSelected || selectionType !== 'leaf')
                            ) {
                                Logger.error(`Метод БЛ ${source.getEndpoint().contract}.${
                                    source.getBinding().query
                                } не вернул записей для окна выбора. 
                            Метод БЛ должен поддерживать параметр фильтрации selection.
                            Подробнее тут: https://wi.sbis.ru/doc/platform/developmentapl/service-development/service-contract/logic/list/list-iterator/`);
                            }
                            return rs;
                        })
                        .catch((error) => {
                            process({ error });
                            return Promise.reject(error);
                        });
                }
            }
        } else {
            loadItemsPromise = Promise.resolve(this.getEmptyItems(items));
        }
        return loadItemsPromise;
    },

    getEmptyItems(currentItems: RecordSet): RecordSet {
        /* make clone and clear to save items format */
        const emptyItems = currentItems.clone();
        emptyItems.clear();
        return emptyItems;
    },

    selectComplete(
        listConfig: IListState,
        selectionType?: ['leaf' | 'node' | 'hiddenNode'],
        multiSelect?: boolean
    ) {
        const {
            items,
            keyProperty,
            root,
            recursiveSelection,
            selectedKeys,
            excludedKeys,
            markedKey,
            filter,
            searchParam,
            parentProperty,
            nodeProperty,
            source,
            selectFields,
        } = listConfig;
        if (!multiSelect && markedKey === undefined) {
            return Promise.resolve(this.getEmptyItems(items));
        }
        const listSelecetedKeys = multiSelect ? selectedKeys : [markedKey];
        let selectionObject: ISelectionObject = {
            selected: listSelecetedKeys,
            excluded: excludedKeys,
        };
        const isRootSelected = listSelecetedKeys.includes(root) && excludedKeys.includes(root);
        const isSearch = !!filter[searchParam];

        if (!recursiveSelection && !(isSearch && isRootSelected)) {
            selectionObject = this.prepareNotRecursiveSelection(
                selectionObject,
                items,
                keyProperty,
                parentProperty,
                nodeProperty,
                root
            );
        }
        const adapter = this.getSourceAdapter(source);
        const selection = this.getSelection(
            selectionObject,
            adapter,
            selectionType,
            recursiveSelection
        );
        const sourceFilter = this.prepareFilter({
            filter,
            selection,
            searchParam,
            parentProperty,
            nodeProperty,
            selectionType,
            root,
            items,
        });

        return this.loadSelectedItems(
            sourceFilter,
            {
                items,
                keyProperty,
                root,
                recursiveSelection,
                selectedKeys: listSelecetedKeys,
                excludedKeys,
                filter,
                searchParam,
                parentProperty,
                nodeProperty,
                source,
                selectFields,
            },
            multiSelect
        );
    },

    // Задача: необходимо поддержать выбора папки без вложений, если чекбоксом отмечена только папка.
    // Для этого используем флаг recursive у платформенного итератора,
    // который как раз позволяет реализовать выбор папки без вложений.
    // Но сейчас есть проблема, если выделить папку и у дочернего элемента снять чекбокс,
    // то всё равно будет выбрана папка, хотя в этом случае должны выбраться вложения.
    // Решаем это добавлением папки в excluded, если снят чекбокс хотя бы у одного дочернего элемента.
    prepareNotRecursiveSelection(
        selection: ISelectionObject,
        items: RecordSet,
        keyProperty: string,
        parentProperty?: string,
        nodeProperty?: string,
        root: TKey = null
    ): ISelectionObject {
        const isHierarchyItem = (key): boolean => {
            const item = items.getRecordById(key);
            return item && item.get(nodeProperty) !== null;
        };

        const hasExcludedChildren = (key): boolean => {
            let hasExcludedChild = false;
            let itemId;

            if (isHierarchyItem(key)) {
                items.each((item) => {
                    if (!hasExcludedChild && item.get(parentProperty) === key) {
                        itemId = item.get(keyProperty);
                        hasExcludedChild =
                            selection.excluded.includes(itemId) || hasExcludedChildren(itemId);
                    }
                });
            }

            return hasExcludedChild;
        };

        if (parentProperty && selection.selected.includes(root)) {
            let key;
            items.each((item) => {
                key = item.get(keyProperty);

                if (
                    isHierarchyItem(key) &&
                    !selection.excluded.includes(key) &&
                    hasExcludedChildren(key)
                ) {
                    selection.excluded.push(key);

                    if (!selection.selected.includes(key)) {
                        selection.selected.push(key);
                    }
                }
            });
        } else {
            selection.selected.forEach((key) => {
                if (!selection.excluded.includes(key) && hasExcludedChildren(key)) {
                    selection.excluded.push(key);
                }
            });
        }

        return selection;
    },
};

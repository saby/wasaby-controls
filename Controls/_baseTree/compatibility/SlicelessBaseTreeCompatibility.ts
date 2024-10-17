import { ExpandController } from 'Controls/expandCollapse';
import { Tree, TreeItem, BaseTreeControl, IBaseTreeControlOptions } from 'Controls/baseTree';
import { checkWasabyEvent } from 'UI/Events';
import { isEqual } from 'Types/object';
import { TKey } from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import { expandCollapse as NotificationCompatibility } from './NotificationCompatibility';

/**
 * Ф-ия, которая дёргается expandController'ом при раскрытии узла
 */
function expandLoader(
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions,
    nodeKey: TKey
): void | Promise<RecordSet | void> {
    // Проверка на случай, что это itemsView, в таком случае вообще загружать ничего не надо
    const shouldLoadChildren = options.sourceController || !options.items;
    const item = treeControl._listViewModel.getItemBySourceKey(nodeKey);

    if (item?.isRoot() || !shouldLoadChildren || treeControl._expandController.isAllExpanded()) {
        return;
    }

    let expandResult;

    if (checkWasabyEvent(options.onLoadExpandedItem)) {
        expandResult = options.onLoadExpandedItem(nodeKey);
    } else {
        expandResult = treeControl._notify('loadExpandedItem', [
            nodeKey,
        ]) as Promise<RecordSet | void>;
    }

    // Надо смотреть на опцию loading при любой загрузке и показывать индикатор,
    // но пока список показывает по событию sourceController'a, оставляю код показа индикаторов
    if (expandResult instanceof Promise) {
        treeControl._displayGlobalIndicator();
        expandResult
            .catch((error) => {
                return error;
            })
            .finally(() => {
                if (treeControl._indicatorsController) {
                    if (treeControl._indicatorsController.shouldHideGlobalIndicator()) {
                        treeControl._indicatorsController.hideGlobalIndicator();
                    }
                }
            });
    }

    return expandResult;
}

function slicelessBaseTreeConstructor(
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): void {
    treeControl._updateExpandedItemsAfterReload = false;
    treeControl._resetExpandedItemsAfterReload = false;
}

function slicelessBaseTreeBeforeMount(
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): void {
    // Создаем _expandController до вызова super._beforeMount, т.к. во время
    // отработки super._beforeMount уже будет нужен
    treeControl._expandController = new ExpandController({
        singleExpand: options.singleExpand,
        expandedItems: options.expandedItems,
        collapsedItems: options.collapsedItems,
        loader: (nodeKey) => expandLoader(treeControl, options, nodeKey),
    });
}

function slicelessBaseTreeDoBeforeMount(treeControl: BaseTreeControl): void {
    // После отработки super._beforeMount создастся модель, обновим её в контроллере
    treeControl._expandController?.updateOptions?.({
        model: treeControl.getViewModel(),
    });
}

function slicelessBaseTreeAfterMount(
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): void {
    if (treeControl._expandedItemsToNotify) {
        if (checkWasabyEvent(options.onExpandedItemsChanged)) {
            options.onExpandedItemsChanged(treeControl._expandedItemsToNotify);
        } else if (checkWasabyEvent(options.expandedItemsChangedCallback)) {
            options.expandedItemsChangedCallback(treeControl._expandedItemsToNotify);
        } else {
            options.notifyCallback('expandedItemsChanged', [treeControl._expandedItemsToNotify]);
        }
        treeControl._expandedItemsToNotify = null;
    } else if (options.nodeHistoryId) {
        if (checkWasabyEvent(options.onExpandedItemsChanged)) {
            options.onExpandedItemsChanged(treeControl._expandController.getExpandedItems());
        } else if (checkWasabyEvent(options.expandedItemsChangedCallback)) {
            options.expandedItemsChangedCallback(treeControl._expandController.getExpandedItems());
        } else {
            options.notifyCallback('expandedItemsChanged', [
                treeControl._expandController.getExpandedItems(),
            ]);
        }
    }
}

function slicelessBaseTreeStartBeforeUpdate(
    treeControl: BaseTreeControl,
    newOptions: IBaseTreeControlOptions
): void {
    // При смене корня, не надо запрашивать все открытые папки,
    // т.к. их может не быть и мы загрузим много лишних данных.
    // Так же учитываем, что вместе со сменой root могут поменять и expandedItems - тогда не надо их сбрасывать.
    // TODO убрать таску https://online.sbis.ru/opendoc.html?guid=0e741582-a590-4dfb-918d-c4e60245d217&client=3
    // UPD 01.12.23
    // на схеме со storeId reload происходит всегда до смены root,
    // Поэтому до reload мы сюда никогда не попадём,
    // Зато можем попасть когда _wasReload уже сброшен
    const shouldResetExpandedItems =
        !(
            newOptions.searchStartingWith === 'root' &&
            treeControl._expandController.isAllExpanded()
        ) &&
        isEqual(newOptions.expandedItems, treeControl._options.expandedItems) &&
        !newOptions.task1187672730 &&
        !newOptions.storeId;
    if (shouldResetExpandedItems) {
        if (treeControl._wasReload) {
            resetExpandedItems(treeControl);
        } else {
            treeControl._resetExpandedItemsAfterReload = true;
        }
    }
}

function slicelessBaseTreeAfterUpdate(
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): void {
    if (treeControl._expandedItemsToNotify) {
        if (checkWasabyEvent(options.onExpandedItemsChanged)) {
            options.onExpandedItemsChanged(treeControl._expandedItemsToNotify);
        } else if (checkWasabyEvent(options.expandedItemsChangedCallback)) {
            options.expandedItemsChangedCallback(treeControl._expandedItemsToNotify);
        } else {
            options.notifyCallback('expandedItemsChanged', [treeControl._expandedItemsToNotify]);
        }
        treeControl._expandedItemsToNotify = null;
    }
}

function slicelessBaseTreeEndBeforeUpdate(
    treeControl: BaseTreeControl,
    newOptions: IBaseTreeControlOptions
) {
    if (treeControl._expandController) {
        const sourceController = treeControl.getSourceController();
        const viewModel = treeControl.getViewModel() as Tree;
        const searchValueChanged = treeControl._options.searchValue !== newOptions.searchValue;
        const isSourceControllerLoading = sourceController && sourceController.isLoading();

        treeControl._expandController.updateOptions({
            model: viewModel,
            singleExpand: newOptions.singleExpand,
            collapsedItems: newOptions.collapsedItems,
        });

        const currentExpandedItems = treeControl._expandController.getExpandedItems();
        const expandedItemsFromSourceCtrl = newOptions.storeId
            ? newOptions.expandedItems
            : sourceController && sourceController.getExpandedItems();
        const expandedItemsChanged =
            newOptions.expandedItems && !isEqual(newOptions.expandedItems, currentExpandedItems);
        // expandedItems в sourceController приоритетнее чем наши. Поэтому Если в sourceController
        // нет expandedItems, а у нас есть, значит нужно сбросить раскрытые узлы
        const wasResetExpandedItems =
            !expandedItemsChanged &&
            expandedItemsFromSourceCtrl &&
            !expandedItemsFromSourceCtrl.length &&
            currentExpandedItems &&
            currentExpandedItems.length;
        if (wasResetExpandedItems) {
            resetExpandedItems(treeControl);
        } else if (expandedItemsChanged) {
            if (
                ((newOptions.source === treeControl._options.source ||
                    newOptions.sourceController) &&
                    !isSourceControllerLoading) ||
                (searchValueChanged && newOptions.sourceController)
            ) {
                if (viewModel) {
                    // Проставляем hasMoreStorage до простановки expandedItems,
                    // чтобы футеры узлов правильно посчитать за один раз
                    treeControl._updateHasMoreStorage(newOptions, newOptions.expandedItems);

                    treeControl._collectionChangeCauseByNode = true;
                    // Отключаем загрузку данных контроллером, т.к. все данные уже загружены
                    // нужно только проставить новое состояние в контроллер
                    treeControl._expandController.disableLoader();
                    treeControl._expandController.setExpandedItems(newOptions.expandedItems);
                    treeControl._expandController.enableLoader();

                    if (newOptions.markerMoveMode === 'leaves') {
                        treeControl._applyMarkedLeaf(
                            newOptions.markedKey,
                            viewModel,
                            newOptions.slicelessGetMarkerController(treeControl, newOptions)
                        );
                    }
                }
            } else {
                treeControl._updateExpandedItemsAfterReload = true;
            }

            if (
                sourceController &&
                !isEqual(newOptions.expandedItems, sourceController.getExpandedItems())
            ) {
                if (newOptions.childrenLoadMode === 'always') {
                    sourceController.resetCollapsedNodes(newOptions.expandedItems);
                }
                sourceController.setExpandedItems(newOptions.expandedItems);
            }
        }
        if (treeControl._toggleExpandedResolver) {
            treeControl._toggleExpandedResolver();
            treeControl._toggleExpandedResolver = null;
        }
    }
}

function slicelessBaseTreeAfterCollectionRemove(
    removedItems: TreeItem[],
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): void {
    const result = treeControl._expandController.onCollectionRemove(removedItems);
    changeExpandCollapseState(result.expandedItems, result.collapsedItems, treeControl, options);
}

function slicelessBaseTreeStartAfterReloadCallback(
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): void {
    // На _beforeUpdate уже поздно обновлять контроллер, т.к. данный метод вызовется
    // из BaseControl::_beforeUpdate до логики в BaseTreeControl::_beforeUpdate
    // и он заюзает expandController со старой моделью
    // TODO удалить после https://online.sbis.ru/opendoc.html?guid=961081b9-a94d-4694-9165-cd56cc843ab2
    treeControl._expandController?.updateOptions({
        model: treeControl._listViewModel,
    });
}

function slicelessBaseTreeEndAfterReloadCallback(
    loadedList: RecordSet,
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): void {
    // Всегда нужно пересчитывать hasMoreStorage, т.к. даже если нет загруженных элементов или не deepReload,
    // то мы должны сбросить hasMoreStorage
    // Вызываем метод с флагом reBuildNodeFooters, т.к. после перезагрузки не будет события с добавлением
    // элементов и футеры без флага не посчитаются
    const expandedItems = treeControl._updateExpandedItemsAfterReload
        ? options.expandedItems
        : getExpandedItems(treeControl);
    treeControl._updateHasMoreStorage(options, expandedItems, true, loadedList);

    if (treeControl._updateExpandedItemsAfterReload) {
        treeControl._expandController.disableLoader();
        treeControl._expandController.setExpandedItems(options.expandedItems);
        treeControl._expandController.enableLoader();
        treeControl._updateExpandedItemsAfterReload = false;
    }

    if (treeControl._resetExpandedItemsAfterReload) {
        resetExpandedItems(treeControl);
        treeControl._resetExpandedItemsAfterReload = false;
    }
}

const SlicelessBaseTreeCompatibility = {
    slicelessBaseTreeConstructor,
    slicelessBaseTreeBeforeMount,
    slicelessBaseTreeDoBeforeMount,
    slicelessBaseTreeAfterMount,
    slicelessBaseTreeStartBeforeUpdate,
    slicelessBaseTreeEndBeforeUpdate,
    slicelessBaseTreeAfterUpdate,
    slicelessBaseTreeAfterCollectionRemove,
    slicelessBaseTreeStartAfterReloadCallback,
    slicelessBaseTreeEndAfterReloadCallback,
};

export { SlicelessBaseTreeCompatibility };

export type TSlicelessBaseTreeCompatibility = typeof SlicelessBaseTreeCompatibility;

function changeExpandCollapseState(
    expandedItems: TKey[],
    collapsedItems: TKey[],
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): void {
    const expandedItemsChanged = !isEqual(getExpandedItems(treeControl), expandedItems);
    const collapsedItemsChanged = !isEqual(getCollapsedItems(treeControl), collapsedItems);

    if (!options.expandedItems && expandedItemsChanged) {
        treeControl._updateHasMoreStorage(options, expandedItems);

        // Сперва обновляем sourceController, т.к. обновление коллекции вызовет событие об изменении
        // По событию об изменение мы можем пересчитать selectedCount, кинем соответствующее событие
        // По нему будет обновлен контекст, который синхронно вызовет _beforeUpdate.
        // И в этом _beforeUpdate sourceController уже должен быть с правильными expandedItems
        const sourceController = treeControl.getSourceController();
        if (sourceController) {
            if (options.childrenLoadMode === 'always') {
                sourceController.resetCollapsedNodes(expandedItems);
            }
            sourceController.setExpandedItems(expandedItems);
        }

        treeControl._expandController.setExpandedItems(expandedItems);
    }

    if (!options.collapsedItems && collapsedItemsChanged) {
        treeControl._expandController.setCollapsedItems(collapsedItems);
    }

    if (expandedItemsChanged) {
        if (checkWasabyEvent(options.onExpandedItemsChanged)) {
            options.onExpandedItemsChanged(expandedItems);
        } else if (checkWasabyEvent(options.expandedItemsChangedCallback)) {
            options.expandedItemsChangedCallback(expandedItems);
        } else {
            options.notifyCallback('expandedItemsChanged', [expandedItems]);
        }
    }
    if (collapsedItemsChanged) {
        options.notifyCallback('collapsedItemsChanged', [collapsedItems]);
    }
}

function isExpanded(
    key: TKey,
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): boolean {
    return treeControl._expandController.isItemExpanded(key);
}

function isExpandAll(
    keys: TKey[] | undefined,
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): boolean {
    return treeControl._expandController?.isAllExpanded?.(keys);
}

function isCollapsed(
    key: TKey,
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): boolean {
    return treeControl._expandController.isItemCollapsed(key);
}

function getExpandedItems(treeControl: BaseTreeControl): TKey[] {
    return treeControl._expandController?.getExpandedItems?.() ?? [];
}

function getCollapsedItems(treeControl: BaseTreeControl): TKey[] {
    return treeControl._expandController.getCollapsedItems();
}

function toggleExpanded(
    key: TKey,
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): Promise<void> {
    if (options.supportExpand === false || treeControl._listViewModel.SupportExpand === false) {
        return Promise.resolve();
    }
    const item = treeControl._listViewModel.getItemBySourceKey(key);

    const contents = item.getContents();
    const nodeKey = contents.getKey();
    const expanded = !treeControl._expandController.isItemExpanded(nodeKey);

    return Promise.resolve(() => {
        treeControl._displayGlobalIndicator();
    })
        .then(() => {
            const method =
                NotificationCompatibility[expanded ? 'beforeItemExpand' : 'beforeItemCollapse'];
            return method(key, treeControl, options);
        })
        .then(
            () => {
                if (treeControl._indicatorsController.shouldHideGlobalIndicator()) {
                    treeControl._indicatorsController.hideGlobalIndicator();
                }
                return doExpand(item, treeControl, options)
                    .then(() => {
                        // Если узел сворачивается - автоматически высчитывать следующий разворачиваемый элемент не требуется.
                        // Ошибка: https://online.sbis.ru/opendoc.html?guid=98762b51-6b69-4612-9468-1c38adaa2606
                        if (
                            options.markerMoveMode === 'leaves' &&
                            expanded !== false &&
                            treeControl._goToNextAfterExpand
                        ) {
                            treeControl._tempItem = nodeKey;
                            return treeControl.goToNext();
                        }
                    })
                    .catch((e) => {
                        return e;
                    });
            },
            () => {
                if (treeControl._indicatorsController.shouldHideGlobalIndicator()) {
                    treeControl._indicatorsController.hideGlobalIndicator();
                }
            }
        );
}

function doExpand(
    item: TreeItem,
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): Promise<unknown> {
    const contents = item.getContents();
    const nodeKey = contents.getKey();
    const expanded = !treeControl._expandController.isItemExpanded(nodeKey);

    const _doExpand = () => {
        return new Promise((resolve) => {
            return Promise.resolve(treeControl._expandController.toggleItem(nodeKey))
                .then((result) => {
                    if (treeControl._destroyed) {
                        return Promise.reject();
                    }

                    // Если есть опция expandedItems, то это значит что состояние expanded в модель
                    // мы применим на _beforeUpdate. В этот же момент нужно зарезолвить промис.
                    if (options.expandedItems) {
                        treeControl._toggleExpandedResolver = resolve;
                    } else {
                        resolve(null);
                    }

                    changeExpandCollapseState(
                        result.expandedItems,
                        result.collapsedItems,
                        treeControl,
                        options
                    );
                    NotificationCompatibility[expanded ? 'afterItemExpand' : 'afterItemCollapse'](
                        nodeKey,
                        treeControl,
                        options
                    );
                })
                .catch((e) => {
                    return resolve(e);
                });
        });
    };

    NotificationCompatibility[expanded ? 'itemExpand' : 'itemCollapse'](
        nodeKey,
        treeControl,
        options
    );

    treeControl._collectionChangeCauseByNode = true;

    // Если сворачивается узел, внутри которого запущено редактирование, то его следует закрыть
    if (treeControl._shouldCancelEditing([item.key])) {
        return treeControl.cancelEdit().then((result) => {
            if (!(result && result.canceled)) {
                return _doExpand();
            }
            return result;
        });
    } else {
        return _doExpand();
    }
}

function expand(
    key: TKey,
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): Promise<void> {
    const args = [key, treeControl, options] as const;
    return isExpanded(...args) ? Promise.resolve() : toggleExpanded(...args);
}

function collapse(
    key: TKey,
    treeControl: BaseTreeControl,
    options: IBaseTreeControlOptions
): Promise<void> {
    const args = [key, treeControl, options] as const;
    return isCollapsed(...args) ? Promise.resolve() : toggleExpanded(...args);
}

function beforeStatDrag(key: TKey, treeControl: BaseTreeControl, options: IBaseTreeControlOptions) {
    const result = treeControl._expandController.collapseItem(key);
    changeExpandCollapseState(result.expandedItems, result.collapsedItems, treeControl, options);
}

function resetExpandedItems(treeControl: BaseTreeControl): void {
    if (!treeControl._listViewModel) {
        return;
    }

    const reset = () => {
        const result = treeControl._expandController?.resetExpandedItems?.();

        if (treeControl._isMounted) {
            changeExpandCollapseState(
                result.expandedItems,
                result.collapsedItems,
                treeControl,
                treeControl._options
            );
        }
    };

    if (treeControl._shouldCancelEditing(getExpandedItems(treeControl))) {
        treeControl.cancelEdit().then((result) => {
            if (!(result && result.canceled)) {
                reset();
            }
            return result;
        });
    } else {
        reset();
    }
}

export const OldTreeLogic = {
    isExpanded,
    isExpandAll,
    expand,
    collapse,
    getExpandedItems,
    beforeStatDrag,
    resetExpandedItems,
};

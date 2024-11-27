/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import {
    IPropertyGridDataFactory,
    IPropertyGridDataFactoryArguments,
} from './interface/IPropertyGridDataFactory';
import { IProperty, IPropertyGrid } from 'Controls/propertyGrid';
import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';
import { addPageDeps } from 'UI/Deps';
import { object } from 'Types/util';
import { Logger } from 'UICommon/Utils';
import { isEqual } from 'Types/object';
import type { NewSourceController } from 'Controls/dataSource';

/**
 * Фабрика данных.
 * @class Controls/_dataFactory/PropertyGrid
 * @private
 */
function loadData(
    config: IPropertyGridDataFactoryArguments
): Promise<IPropertyGridDataFactoryArguments> {
    const loadPromises = getLoadPromisesFromDescription(
        config.typeDescription,
        config.editingObject,
        config.keyProperty,
        config.valueProperty
    );
    const loadPromise = Promise.all(loadPromises).then((typeDescription) => {
        return {
            editingObject: config.editingObject,
            typeDescription,
        };
    });
    if (config.loadDataTimeout) {
        return wrapTimeout(loadPromise, config.loadDataTimeout).catch(() => {
            return config;
        });
    } else {
        return loadPromise.catch(() => {
            return config;
        });
    }
}

function getLoadPromisesFromDescription(
    description: IProperty[],
    editingObject: IPropertyGrid.TEditingObject,
    keyProperty = 'name',
    valueProperty = 'value'
): Promise<IProperty>[] {
    const loadPromises = [];
    description.forEach((property: IProperty) => {
        let loadPromise;

        if (property.editorOptions?.source) {
            let propertyValue = object.getPropertyValue(editingObject, property[keyProperty]);

            // Для совместимости с фильтром, пока значение хранится в структуре, а не в фильтре
            if (propertyValue === undefined && property[valueProperty] !== undefined) {
                propertyValue = property.value;
            }

            if (property.type === 'lookup') {
                loadPromise = loadLookupDeps(property, propertyValue as [], keyProperty);
            }

            if (property.type === 'list' || property.type === 'dropdown') {
                loadPromise = loadListDeps(property, propertyValue);
            }
        }

        if (property.type === 'propertyGrid') {
            loadPromise = loadData({
                typeDescription: property.editorOptions.typeDescription,
            })
                .then((propertyGridDescription) => {
                    property.editorOptions.typeDescription = propertyGridDescription;
                    return property;
                })
                .catch(() => {
                    return property;
                });
        }

        if (loadPromise) {
            loadPromises.push(loadPromise);
        } else {
            loadPromises.push(Promise.resolve(property));
        }
    });
    return loadPromises;
}

function getLookupValue(propertyValue) {
    if (Array.isArray(propertyValue)) {
        return propertyValue;
    } else if (propertyValue !== null && propertyValue !== undefined) {
        return [propertyValue];
    } else {
        return [];
    }
}

function loadLookupDeps(property: IProperty, propertyValue?: []): Promise<IProperty> | void {
    const keyProperty = property.editorOptions.keyProperty;

    if (!keyProperty) {
        Logger.error(
            `Controls/dataFactory:PropertyGrid для свойства с именем ${property.name} и типом ${property.type}
             не передана опция keyProperty в editorOptions.`,
            this
        );
        return;
    }
    // Если в лукапе ничего не выбрано, то и загружать для него ничего не надо
    const hasSelected = !!getLookupValue(propertyValue).length;
    if (hasSelected) {
        return loadListDeps(property, propertyValue);
    }
}

function loadListDeps(property: IProperty, propertyValue?: []): Promise<IProperty> {
    const { editorOptions, editorOptionsName, type: propType } = property;
    const propertyChanged = !isEqual(property.value, property.resetValue);
    const promises = [];
    const dndProviderName = editorOptions.dragNDropProviderName as string;
    promises.push(
        loadAsync('Controls/dataSource').then(() => {
            const sourceController = getSourceController(property);
            const filter = {
                ...editorOptions.filter,
            };
            if (
                editorOptions.source &&
                (propType === 'lookup' || (propType === 'dropdown' && editorOptions.navigation))
            ) {
                filter[editorOptions.keyProperty] = getLookupValue(propertyValue);
            }
            if (propType === 'lookup') {
                sourceController.setNavigation(null);
            }
            sourceController.setFilter(filter);
            return sourceController
                .reload(undefined, true)
                .then((loadResult) => {
                    let result = loadResult;
                    if (propType === 'dropdown' && propertyChanged && editorOptions.navigation) {
                        editorOptions.selectedItems = loadResult;
                        result = null;
                    }
                    editorOptions.items = result;
                    editorOptions.sourceController =
                        editorOptions.sourceController || getSourceController(property);
                    editorOptions.sourceController.setItems(result);
                    if (editorOptions.nodeHistoryId) {
                        editorOptions.expandedItems = sourceController.getExpandedItems();
                    }

                    return property;
                })
                .catch(() => {
                    return property;
                });
        })
    );
    if (dndProviderName) {
        addPageDeps([dndProviderName]);
        promises.push(loadAsync(dndProviderName));
    }
    if (editorOptionsName) {
        promises.push(loadAsync(editorOptionsName));
    }
    return Promise.all(promises).then(([loadDataPromiseResult]) => {
        return loadDataPromiseResult;
    });
}

function getSourceController({ editorOptions }: IProperty): NewSourceController {
    const SourceController =
        loadSync<typeof import('Controls/dataSource')>('Controls/dataSource').NewSourceController;
    return new SourceController({
        source: editorOptions.source,
        filter: editorOptions.filter,
        keyProperty: editorOptions.keyProperty,
        navigation: editorOptions.navigation,
        parentProperty: editorOptions.parentProperty,
        expandedItems: editorOptions.expandedItems,
        nodeHistoryId: editorOptions.nodeHistoryId,
        nodeHistoryType: editorOptions.nodeHistoryType,
        root: editorOptions.root,
    });
}

const dataFactory: IPropertyGridDataFactory = {
    loadData,
    createSlice(
        dataFactoryArguments: IPropertyGridDataFactoryArguments
    ): IPropertyGridDataFactoryArguments {
        return dataFactoryArguments;
    },
};

export default dataFactory;

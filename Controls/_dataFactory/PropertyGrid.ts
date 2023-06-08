/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import {
    IPropertyGridDataFactory,
    IPropertyGridDataFactoryArguments,
} from './interface/IPropertyGridDataFactory';
import { IProperty, IPropertyGrid } from 'Controls/propertyGrid';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';
import { addPageDeps } from 'UI/Deps';
import { object } from 'Types/util';

function loadData(
    config: IPropertyGridDataFactoryArguments
): Promise<IPropertyGridDataFactoryArguments> {
    const loadPromises = getLoadPromisesFromDescription(
        config.typeDescription,
        config.editingObject
    );
    const loadPromise = Promise.all(loadPromises).then((typeDescription) => {
        return {
            editingObject: config.editingObject,
            typeDescription,
        };
    });
    return wrapTimeout(loadPromise, config.loadDataTimeout).catch(() => {
        return config.typeDescription;
    });
}

function getLoadPromisesFromDescription(
    description: IProperty[],
    editingObject: IPropertyGrid.TEditingObject
): Promise<IProperty>[] {
    const loadPromises = [];
    description.forEach((property: IProperty) => {
        let loadPromise;

        if (property.type === 'lookup') {
            const propertyValue = object.getPropertyValue(
                editingObject,
                property.name
            );

            // Если в лукапе ничего не выбрано, то и загружать для него ничего не надо
            if (propertyValue?.length) {
                loadPromise = loadListDeps(property, propertyValue);
            }
        }
        if (property.type === 'list') {
            loadPromise = loadListDeps(property);
        }
        if (property.type === 'propertyGrid') {
            loadPromise = loadData({
                typeDescription: property.editorOptions.typeDescription,
            })
                .then((propertyGridDescription) => {
                    property.editorOptions.typeDescription =
                        propertyGridDescription;
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

function loadListDeps(
    property: IProperty,
    propertyValue?: []
): Promise<IProperty> {
    const { editorOptions, editorOptionsName } = property;
    const promises = [];
    const dndProviderName = editorOptions.dragNDropProviderName as string;
    promises.push(
        import('Controls/dataSource').then(({ NewSourceController }) => {
            const sourceController = new NewSourceController({
                source: editorOptions.source,
                filter: editorOptions.filter,
                keyProperty: editorOptions.keyProperty,
                navigation: editorOptions.navigation,
                parentProperty: editorOptions.parentProperty,
                expandedItems: editorOptions.expandedItems,
                nodeHistoryId: property.editorOptions.nodeHistoryId,
                nodeHistoryType: property.editorOptions.nodeHistoryType,
            });
            if (property.type === 'lookup' && editorOptions.source) {
                const filter = {
                    ...editorOptions.filter,
                };
                const keyProperty = editorOptions.keyProperty;
                filter[keyProperty] = propertyValue;
                sourceController.setFilter(filter);
            }
            return sourceController
                .reload(undefined, true)
                .then((loadResult) => {
                    editorOptions.items = loadResult;
                    if (property.editorOptions.nodeHistoryId) {
                        property.editorOptions.expandedItems =
                            sourceController.getExpandedItems();
                    }
                    if (!editorOptions.sourceController) {
                        editorOptions.sourceController = sourceController;
                    } else {
                        editorOptions.sourceController.setItems(loadResult);
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
const dataFactory: IPropertyGridDataFactory = {
    loadData,
    createSlice(
        dataFactoryArguments: IPropertyGridDataFactoryArguments
    ): IPropertyGridDataFactoryArguments {
        return dataFactoryArguments;
    },
};

export default dataFactory;

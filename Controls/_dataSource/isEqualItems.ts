import type { RecordSet } from 'Types/collection';

// @ts-ignore
import * as cInstance from 'Core/core-instance';

function getModelModuleName(model: string | Function): string {
    let name;

    if (typeof model === 'function') {
        name = model.prototype._moduleName;
    } else {
        name = model;
    }

    return name;
}

function isEqualFormat(oldList: RecordSet, newList: RecordSet): boolean {
    const oldListFormat =
        oldList && oldList['[Types/_entity/FormattableMixin]'] && oldList.getFormat(true);
    const newListFormat =
        newList && newList['[Types/_entity/FormattableMixin]'] && newList.getFormat(true);
    const isListsEmpty = !newList.getCount() || !oldList.getCount();
    return (
        (oldListFormat && newListFormat && oldListFormat.isEqual(newListFormat)) ||
        isListsEmpty ||
        (!oldListFormat && !newListFormat)
    );
}

export function isEqualItems(oldList: RecordSet, newList: RecordSet): boolean {
    const getProtoOf = Object.getPrototypeOf.bind(Object);
    const items1Model = oldList && oldList['[Types/_collection/RecordSet]'] && oldList.getModel();
    const items2Model = newList && newList['[Types/_collection/RecordSet]'] && newList.getModel();
    let isModelEqual = items1Model === items2Model;

    if (!isModelEqual && getModelModuleName(items1Model) === getModelModuleName(items2Model)) {
        isModelEqual = true;
    }
    return (
        oldList &&
        cInstance.instanceOfModule(oldList, 'Types/collection:RecordSet') &&
        isModelEqual &&
        newList.getKeyProperty() === oldList.getKeyProperty() &&
        // eslint-disable-next-line eqeqeq
        getProtoOf(newList).constructor == getProtoOf(newList).constructor &&
        // eslint-disable-next-line eqeqeq
        getProtoOf(newList.getAdapter()).constructor ==
            getProtoOf(oldList.getAdapter()).constructor &&
        isEqualFormat(oldList, newList)
    );
}

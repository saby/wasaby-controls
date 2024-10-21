/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import chain = require('Types/chain');
import Utils = require('Types/util');
import { RecordSet } from 'Types/collection';

/* мапинг новой структуры в старую*/
const recordToSructureElemMap = {
    id: 'internalValueField',
    caption: 'internalCaptionField',
    value: 'value',
    resetValue: 'resetValue',
    textValue: 'caption',
    visibility: 'visibilityValue',
};

/* Мапинг старой стрктуры в новую */
const structureMap = {};
for (const i in recordToSructureElemMap) {
    if (recordToSructureElemMap.hasOwnProperty(i)) {
        structureMap[recordToSructureElemMap[i]] = i;
    }
}

function convertToFilterStructure(items: RecordSet) {
    return chain
        .factory(items)
        .map((item) => {
            const itemStructureItem = {};
            for (const i in structureMap) {
                if (
                    Utils.object.getPropertyValue(item, structureMap[i]) !== undefined &&
                    structureMap.hasOwnProperty(i)
                ) {
                    itemStructureItem[i] = Utils.object.getPropertyValue(item, structureMap[i]);
                }
            }
            return itemStructureItem;
        })
        .value();
}

function convertToSourceDataArray(
    filterStructure: object[],
    visibilitiesObject?: Record<string, boolean>
) {
    const dataArray = [];
    chain.factory(filterStructure).each((item) => {
        const rsItem = {};
        for (const i in recordToSructureElemMap) {
            if (
                Utils.object.getPropertyValue(item, recordToSructureElemMap[i]) !== undefined &&
                recordToSructureElemMap.hasOwnProperty(i)
            ) {
                if (
                    i === 'visibility' &&
                    visibilitiesObject &&
                    !visibilitiesObject.hasOwnProperty(item.internalValueField)
                ) {
                    continue;
                }
                rsItem[i] = Utils.object.getPropertyValue(item, recordToSructureElemMap[i]);
            }
        }
        dataArray.push(rsItem);
    });
    return dataArray;
}

function convertToSourceData(filterStructure: object[]) {
    const dataArray = convertToSourceDataArray(filterStructure);

    return new RecordSet({
        rawData: dataArray,
    });
}

export = {
    convertToFilterStructure,
    convertToSourceData,
    convertToSourceDataArray,
};

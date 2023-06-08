/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { factory } from 'Types/chain';
import CoreClone = require('Core/core-clone');
import { Logger } from 'UI/Utils';

const differentFields = ['id', 'visibility'];

function convertToFilterSource(detailPanelItems: object[]) {
    const filterSource = CoreClone(detailPanelItems);
    factory(filterSource).each((filterSourceItem, index) => {
        for (const property in filterSourceItem) {
            if (filterSourceItem.hasOwnProperty(property)) {
                if (differentFields.indexOf(property) !== -1) {
                    if (property === 'id') {
                        Logger.error(
                            'Controls/filter: В записи используется устаревшая опция id. Для установки ключа записи используйте name.',
                            this
                        );
                    }
                    delete filterSourceItem[property];
                }
            }
        }
        // items from history have a field 'name' instead of 'id'
        filterSourceItem.name = detailPanelItems[index].id
            ? detailPanelItems[index].id
            : detailPanelItems[index].name;
        if (detailPanelItems[index].visibility !== undefined) {
            filterSourceItem.visibility = detailPanelItems[index].visibility;
        }
    });
    return filterSource;
}

function convertToDetailPanelItems(filterSource: object[]) {
    const detailPanelItems = CoreClone(filterSource);
    factory(detailPanelItems).each((detailPanelItem, index) => {
        for (const property in detailPanelItem) {
            if (detailPanelItem.hasOwnProperty(property)) {
                if (differentFields.indexOf(property) !== -1) {
                    delete detailPanelItem[property];
                }
            }
        }
        const filterItem = filterSource[index];
        detailPanelItem.visibility =
            filterItem.viewMode === 'extended' || filterItem.editorTemplateName
                ? filterItem.visibility
                : undefined;
    });
    return detailPanelItems;
}

export = {
    convertToFilterSource,
    convertToDetailPanelItems,
};

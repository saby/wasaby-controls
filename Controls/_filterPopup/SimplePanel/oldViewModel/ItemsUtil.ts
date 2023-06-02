/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import displayLib = require('Controls/display');
import cInstance = require('Core/core-instance');
import Utils = require('Types/util');

const ItemsUtil = {
    getDefaultDisplayFlat(items, cfg, filter) {
        const projCfg = {};
        projCfg.keyProperty = cfg.keyProperty;
        if (cfg.groupingKeyCallback) {
            projCfg.group = cfg.groupingKeyCallback;
        }
        if (cfg.groupProperty) {
            const groupProperty = cfg.groupProperty;
            projCfg.group = (item) => {
                return item.get(groupProperty);
            };
        }
        // todo to support merge strategy replace this code on "projCfg.unique = cfg.loadItemsStrategy === 'merge'".
        // https://online.sbis.ru/opendoc.html?guid=e070a968-f6dd-486b-bd44-4da47198529e
        projCfg.unique = true;
        projCfg.filter = filter;
        projCfg.compatibleReset = true;
        projCfg.collapsedGroups = cfg.collapsedGroups;
        projCfg.groupProperty = cfg.groupProperty;
        projCfg.theme = cfg.theme;
        return displayLib.Abstract.getDefaultDisplay(items, projCfg);
    },

    getPropertyValue(itemContents, field) {
        if (!(itemContents instanceof Object)) {
            return itemContents;
        } else {
            return Utils.object.getPropertyValue(itemContents, field);
        }
    },

    // TODO это наверное к Лехе должно уехать
    getDisplayItemById(display, id, keyProperty) {
        const list = display.getSourceCollection();
        if (cInstance.instanceOfModule(list, 'Types/collection:RecordSet')) {
            return display.getItemBySourceItem(list.getRecordById(id));
        } else {
            let resItem;
            display.each((item) => {
                if (
                    String(
                        ItemsUtil.getPropertyValue(
                            item.getContents(),
                            keyProperty
                        )
                    ) === String(id)
                ) {
                    resItem = item;
                }
            });
            return resItem;
        }
    },

    getFirstItem(display) {
        let itemIdx = 0;
        let item;
        const itemsCount = display.getCount();
        while (itemIdx < itemsCount) {
            item = display.at(itemIdx).getContents();
            if (cInstance.instanceOfModule(item, 'Types/entity:Model')) {
                return display.at(itemIdx).getContents();
            }
            itemIdx++;
        }
    },

    getLastItem(display) {
        let itemIdx = display.getCount() - 1;
        let item;
        while (itemIdx >= 0) {
            item = display.at(itemIdx).getContents();
            if (cInstance.instanceOfModule(item, 'Types/entity:Model')) {
                return item;
            }
            itemIdx--;
        }
    },

    getDisplayItemKey(dispItem, keyProperty) {
        let contents = dispItem.getContents();

        if (contents instanceof Array) {
            // Breadcrumbs key is the key of the last item
            contents = contents[contents.length - 1];
        }

        return ItemsUtil.getPropertyValue(contents, keyProperty);
    },
};
export = ItemsUtil;

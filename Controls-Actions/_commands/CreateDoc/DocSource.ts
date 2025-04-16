import { DataSet, Memory, Query, SbisService } from 'Types/source';
import { Record } from 'Types/entity';
import { createFilter } from 'Controls-Actions/_commands/Utils';
import { Permission } from 'Permission/access';
import { Control } from 'UI/Base';

function _hasRights(zone: string): boolean {
    const [role] = Permission.get([zone]);
    return role.isModify();
}

const options = {
    objectName: 'РеестрИсходящих',
    group: 1,
    icon: 'icon-medium icon-Reports',
    wrapName: 'Документ',
    subGroup: 2,
};

/**
 * Источник данных для Controls-Actions/commands:CreateDoc
 */

export default class DocSource extends Memory {
    protected _uploadItems: Record<string, any>[];
    protected _onlyLeafs: boolean;
    protected _opener: Control;
    constructor(cfg) {
        super(cfg);
        this._uploadItems = null;
        this._opener = cfg.opener;
    }
    getItems() {
        if (!_hasRights('Исходящие')) {
            return Promise.resolve([]);
        }
        if (this._uploadItems) {
            return Promise.resolve(this._uploadItems);
        }
        const filter = new Record({ format: {}, adapter: 'adapter.sbis' });
        filter.set({});
        const myQuery = new Query();
        return new SbisService({
            endpoint: {
                contract: 'РеестрИсходящих',
            },
            binding: {
                query: 'GetSabydocsRegls',
            },
        })
            .query(myQuery)
            .then((data) => {
                const recordSet = data.getAll();
                const items = [];
                recordSet.each((record) => {
                    const docType = record.get('ТипДокумента');
                    const meta = {
                        nameDialog: docType.get('ИмяДиалога'),
                        objectName: docType.get('ИмяОбъекта'),
                        groupType: docType.get('Тип'),
                        documentType: docType.get('@ТипДокумента'),
                    };
                    meta.filter = createFilter(meta, record.get('Идентификатор'));
                    const item = {
                        group: options.group,
                        name: record.get('Название'),
                        parent: null,
                        objectId: docType.get('Тип'),
                        historyId: options.objectName,
                        '@parent': null,
                        id: record.get('Название'),
                        elementId: record.get('Название'),
                        opener: options?.opener,
                        itemRecord: record,
                        meta,
                    };
                    items.push({ ...item, item });
                });
                this._uploadItems = items;
                return items;
            })
            .catch(() => {
                this._uploadItems = [];
                return [];
            });
    }

    query(query) {
        return this.getItems().then((items) => {
            const filter = query.getWhere();
            const filteredItems = items.filter((item) => {
                if (filter.id?.length) {
                    return item.id === filter.id[0];
                }
                if (filter.name) {
                    return item.name.indexOf(filter.name) !== -1;
                }
                return true;
            });
            return new DataSet({
                rawData: {
                    items: filteredItems,
                },
                itemsProperty: 'items',
                keyProperty: 'id',
            });
        });
    }
}

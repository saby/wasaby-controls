import { DataSet, Memory, SbisService } from 'Types/source';
import { Model, Record } from 'Types/entity';
import { factory } from 'Types/chain';
import { createFilter } from 'Controls-Actions/_commands/Utils';
import { Permission } from 'Permission/access';
import { Control } from 'UI/Base';

function _hasRights(zone: string): boolean {
    const [role] = Permission.get([zone]);
    return role.isModify();
}

/**
 * Источник данных для Controls-Actions/commands:Transport
 */

export default class TransportSource extends Memory {
    protected _uploadItems: Record<string, any>[];
    protected _onlyLeafs: boolean;
    protected _opener: Control;
    constructor(cfg) {
        super(cfg);
        this._uploadItems = null;
        this._onlyLeafs = cfg.onlyLeafs;
        this._opener = cfg.opener;
    }
    getItems() {
        if (!_hasRights('Доставки')) {
            return Promise.resolve([]);
        }
        if (this._uploadItems) {
            return Promise.resolve(this._uploadItems);
        }
        return new SbisService({ endpoint: 'Regulation' })
            .call('GroupedStdList', {
                Фильтр: new Record({
                    adapter: 'adapter.sbis',
                    format: [
                        {
                            name: 'DocType',
                            type: 'array',
                            kind: 'string',
                            defaultValue: ['Waybill', 'ConsignmentNote'],
                        },
                    ],
                }),
                ДопПоля: [],
                Навигация: null,
                Сортировка: null,
            })
            .then((listResult) => {
                const items = [];

                // Формирование элементов меню
                factory(listResult.getAll())
                    .toArray()
                    .forEach((regItem: Model) => {
                        const section = regItem?.get('Раздел@');
                        const id = regItem?.get('Идентификатор');

                        if (section) {
                            if (!this._onlyLeafs) {
                                items.push({
                                    id,
                                    group: 2,
                                    subGroup: 1,
                                    name: regItem.get('Название'),
                                    '@parent': section,
                                    parent: null,
                                    historyId: 'Транспорт',
                                });
                            }
                        } else {
                            const docType = regItem.get('ТипДокумента');
                            const meta = {
                                nameDialog: docType.get('ИмяДиалога'),
                                objectName: docType.get('ИмяОбъекта'),
                                groupType: docType.get('Тип'),
                                documentType: docType.get('@ТипДокумента'),
                            };
                            meta.filter = createFilter(meta, id);
                            const item = {
                                id,
                                group: 3,
                                subGroup: 2,
                                name: regItem.get('Название'),
                                '@parent': section,
                                parent: regItem.get('Раздел') || 'TransportElement',
                                elementId: id,
                                opener: this._opener,
                                objectId: id,
                                meta,
                                historyId: 'Транспорт',
                            };
                            items.push({ ...item, item });
                        }
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

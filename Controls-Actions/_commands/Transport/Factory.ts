import { IListDataFactory } from 'Controls/dataFactory';
import { Permission } from 'Permission/access';
import { SbisService } from 'Types/source';
import { factory } from 'Types/chain';
import { Model, Record } from 'Types/entity';
import { createFilter } from '../Utils';

function _hasRights(zone: string): boolean {
    const [role] = Permission.get([zone]);
    return role.isModify();
}

export function getTransportItems(options?: object): Promise {
    return new Promise((resolve) => {
        new SbisService({ endpoint: 'Regulation' })
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
                if (!_hasRights('Доставки')) {
                    resolve({ items: [] });
                }
                const allItems = [];

                // Формирование элементов меню
                factory(listResult.getAll())
                    .toArray()
                    .forEach((regItem: Model) => {
                        const section = regItem?.get('Раздел@');
                        const id = regItem?.get('Идентификатор');

                        if (section) {
                            allItems.push({
                                id,
                                group: 2,
                                subGroup: 1,
                                name: regItem.get('Название'),
                                '@parent': section,
                                parent: null,
                                historyId: 'Транспорт',
                            });
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
                                opener: options?.opener,
                                objectId: id,
                                meta,
                                historyId: 'Транспорт',
                            };
                            allItems.push({ ...item, item });
                        }
                    });

                resolve({
                    needWrap: false,
                    opener: options?.opener,
                    items: allItems,
                });
            })
            .catch(() => {
                resolve({ items: [] });
            });
    });
}

const listDataFactory: IListDataFactory = {
    loadData: () => {
        return getTransportItems();
    },
};

export default listDataFactory;

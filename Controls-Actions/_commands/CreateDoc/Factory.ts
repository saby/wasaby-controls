import { IListDataFactory } from 'Controls/dataFactory';
import { Permission } from 'Permission/access';
import { SbisService, Query } from 'Types/source';
import { Record } from 'Types/entity';
import { createFilter } from '../Utils';

function _hasRights(zone: string): boolean {
    const [role] = Permission.get([zone]);
    return role.isModify();
}

export function getDocItems(): Promise {
    return new Promise((resolve) => {
        if (!_hasRights('Исходящие')) {
            resolve({ items: [] });
        }
        const options = {
            objectName: 'РеестрИсходящих',
            group: 1,
            icon: 'icon-medium icon-Reports',
            wrapName: 'Документ',
            subGroup: 2,
        };
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
            .then(
                (data) => {
                    const recordSet = data.getAll();
                    const itemsArray = [];
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
                        itemsArray.push({ ...item, item });
                    });
                    resolve({
                        needWrap: false,
                        wrapName: 'Документ',
                        opener: options?.opener,
                        icon: options.icon,
                        group: 0,
                        subGroup: 0,
                        items: itemsArray,
                    });
                },
                () => {
                    // в случае ошибки - прокидываем пустой массив. Этот элемент отсечется далее
                    resolve({
                        items: [],
                    });
                }
            );
    });
}

const listDataFactory: IListDataFactory = {
    loadData: () => {
        return getDocItems();
    },
};

export default listDataFactory;

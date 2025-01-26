import { IListDataFactory } from 'Controls/dataFactory';
import { Deferred } from 'Types/deferred';
import { SbisService } from 'Types/source';
import { Permission } from 'Permission/access';
import { Record } from 'Types/entity';
import { factory } from 'Types/chain';
import { createFilter as basicCreateFilter } from '../Utils';

function createFilter(meta, id) {
    const param = basicCreateFilter.call(this, meta, id);
    param['ТипДокумента'] = null;
    param['СозданоИзАккордеона'] = true;
    return param;
}

/**
 * Обработчик получения элементов для кнопки + в аккардеоне.
 * 1. Проверим доступность метода. Если метод не доступен - на мороз!
 * 2. Получим список регламентов для типа документа АвансОтчет. Если список пуст или метод упал - на мороз!
 * 3. Если есть регламент для создания АО - вернём нужный пункт.
 * @public
 */
export function getReportItems(options?: object) {
    const result = new Deferred();

    Promise.all([
        Permission.get(['Авансовые отчеты']),
        new SbisService({ endpoint: 'Regulation' }).call('StdList', {
            Фильтр: new Record({
                adapter: 'adapter.sbis',
                format: [
                    {
                        name: 'DocType',
                        type: 'array',
                        kind: 'string',
                        defaultValue: ['АвансОтчет'],
                    },
                    {
                        name: 'Действующий',
                        type: 'boolean',
                        defaultValue: true,
                    },
                    {
                        name: 'ПоказыватьТипы',
                        type: 'boolean',
                        defaultValue: true,
                    },
                    {
                        name: 'ИсключитьВсеПапки',
                        type: 'boolean',
                        defaultValue: false,
                    },
                    {
                        name: 'ПоказыватьПустыеПапки',
                        type: 'boolean',
                        defaultValue: false,
                    },
                ],
            }),
            ДопПоля: [],
            Навигация: null,
            Сортировка: null,
        }),
    ])
        .then(([access, regList]) => {
            const allItems = [];
            const metaForFilter = {
                nameDialog: '',
                objectName: 'АвансОтчет',
                groupType: 'АвансОтчет',
                documentType: 'АвансОтчет',
            };
            let regulationId;

            /*
         Если метод проверки прав не свалился с ошибкой и вернул true, посмотрим, что вернул список регламентов.
         В противном случае, вернем пустой массив.
         */
            if (access[0].isModify()) {
                /*
             Если метод списка регламентов не упал, посмотрим, что он вернуд.
             В противном случае, вернем пустой массив.
             */
                if (!regList.message) {
                    /*
                 Если регламентов больше 1, т.е. не только АО, но и пользовательские, сделаем основной пункт из
                 которого будет открываться дерево регламентов.
                 В противном случае, вернем массив в котором будет всего 1 элемент - АО.
                 */
                    if (regList.getAll().getCount() > 1) {
                        allItems.push({
                            id: 'ExpRepElemet',
                            group: 1,
                            subGroup: 1,
                            name: 'Авансовый отчет',
                            historyId: 'ExpRepElemet',
                            '@parent': true,
                            parent: null,
                        });
                        factory(regList.getAll())
                            .toArray()
                            .forEach(function (regItem, ind) {
                                const filter = createFilter(
                                    metaForFilter,
                                    regItem.get('Идентификатор')
                                );

                                // metaForFilter.filter = createFilter(metaForFilter, regItem.get('Идентификатор'));
                                allItems.push({
                                    id: regItem.get('Идентификатор'),
                                    group: 2,
                                    subGroup: 1,
                                    name: regItem.get('Название'),
                                    '@parent': regItem.get('Раздел@')
                                        ? regItem.get('Раздел@')
                                        : null,
                                    parent: regItem.get('Раздел')
                                        ? regItem.get('Раздел')
                                        : 'ExpRepElemet',
                                    elementId: regItem.get('Идентификатор'),
                                    opener: options?.opener,
                                    objectId: regItem.get('Идентификатор'),
                                    historyId: 'АвансОтчет',
                                    regulations: regItem.get('Идентификатор'),
                                    meta: {
                                        nameDialog: '',
                                        objectName: 'АвансОтчет',
                                        groupType: 'АвансОтчет',
                                        documentType: 'АвансОтчет',
                                        filter,
                                    },
                                });
                            });
                        result.callback({
                            needWrap: false,
                            wrapName: '',
                            opener: options?.opener,
                            items: allItems,
                        });
                    } else {
                        regulationId = regList.getRow(0).get('Идентификатор');
                        const filter = createFilter(metaForFilter, regulationId);
                        result.callback({
                            needWrap: false,
                            wrapName: '',
                            opener: options?.opener,
                            items: [
                                {
                                    id: regulationId,
                                    group: 2,
                                    subGroup: 1,
                                    name: 'Авансовый отчет',
                                    '@parent': null,
                                    parent: null,
                                    elementId: regulationId,
                                    opener: options?.opener,
                                    objectId: regulationId,
                                    historyId: 'АвансОтчет',
                                    meta: {
                                        nameDialog: '',
                                        objectName: 'АвансОтчет',
                                        groupType: 'АвансОтчет',
                                        documentType: 'АвансОтчет',
                                        filter,
                                    },
                                },
                            ],
                        });
                    }
                } else {
                    result.callback({ items: [] });
                }
            } else {
                result.callback({ items: [] });
            }
        })
        .catch((error: Error) => {
            result.callback({ items: [] });
        });
    return result;
}

const listDataFactory: IListDataFactory = {
    loadData: () => {
        return getReportItems();
    },
};

export default listDataFactory;

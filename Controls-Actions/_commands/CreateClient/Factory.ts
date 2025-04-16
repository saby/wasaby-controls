import { IListDataFactory } from 'Controls/dataFactory';
import { Permission } from 'Permission/access';

export function getClientsItems(options?: object) {
    const [zone] = Permission.get(['Контрагенты']);
    return new Promise((resolve) => {
        if (zone.isModify()) {
            resolve({
                needWrap: true,
                wrapName: 'Клиент',
                opener: options?.opener,
                group: 3,
                subGroup: 2,
                items: [
                    {
                        id: 'Организация',
                        name: 'Организация',
                        '@parent': null,
                        parent: null,
                        elementId: 'Организация',
                        opener: options?.opener,
                        objectId: 'Организация',
                        historyId: 'Клиент',
                        clientType: 'Организация',
                        meta: {
                            groupType: 'Контрагент',
                            typeClient: 'Организация',
                        },
                    },
                    {
                        id: 'ИП',
                        name: 'ИП',
                        '@parent': null,
                        parent: null,
                        elementId: 'ИП',
                        opener: options?.opener,
                        objectId: 'ИП',
                        historyId: 'Клиент',
                        fixed: false,
                        clientType: 'ИП',
                        meta: {
                            groupType: 'Контрагент',
                            typeClient: 'ИП',
                        },
                    },
                    {
                        id: 'Физическое лицо',
                        name: 'Физическое лицо',
                        '@parent': null,
                        parent: null,
                        elementId: 'Физическое лицо',
                        opener: options?.opener,
                        objectId: 'Физическое лицо',
                        historyId: 'Клиент',
                        fixed: false,
                        clientType: 'Физическое лицо',
                        meta: {
                            groupType: 'Контрагент',
                            typeClient: 'Физическое лицо',
                        },
                    },
                ],
            });
        } else {
            resolve({ items: [] });
        }
    });
}

const listDataFactory: IListDataFactory = {
    loadData: () => {
        return getClientsItems();
    },
};

export default listDataFactory;

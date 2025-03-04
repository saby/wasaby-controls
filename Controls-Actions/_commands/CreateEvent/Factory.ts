import { IListDataFactory } from 'Controls/dataFactory';
import { Permission } from 'Permission/access';

function checkRights() {
    const [activities] = Permission.get(['CrmActivities']);
    return activities.isModify();
}

function loadItems() {
    return new Promise((resolve) => {
        import('Types/source').then(({ SbisService }) => {
            new SbisService({
                endpoint: 'CRMEvent',
                binding: {
                    query: 'GetActivityCommand',
                },
                keyProperty: 'Идентификатор',
            })
                .query()
                .then((data) => {
                    resolve(data.getAll());
                });
        });
    });
}

export function getEventItems(options?: object) {
    return new Promise((resolve) => {
        if (!checkRights()) {
            resolve({ items: [] });
        } else {
            loadItems().then((data) => {
                const allItems = [];
                data.forEach(function (record) {
                    allItems.push({
                        id: record.getId(),
                        name: record.get('Название'),
                        '@parent': record.get('Раздел@'),
                        parent: record.get('Раздел'),
                        elementId: record.getId(),
                        opener: options?.opener,
                        objectId: record.getId(),
                        icon: 'icon-medium ' + record.get('icon'),
                        historyId: 'CRMEvent',
                        needIcon: true,
                        fixed: false,
                        eventType: record.get('EventType'),
                        planedEvent: record.get('EventKind'),
                        meta: {
                            groupType: 'CRMEvent',
                            contactKind: record.get('EventKind'),
                            contactType: record.get('EventType'),
                        },
                    });
                });
                resolve({
                    needWrap: true,
                    wrapName: 'Событие',
                    opener: options?.opener,
                    group: 3,
                    subGroup: 1,
                    items: allItems,
                });
            });
        }
    });
}

const listDataFactory: IListDataFactory = {
    loadData: () => {
        return getEventItems();
    },
};

export default listDataFactory;

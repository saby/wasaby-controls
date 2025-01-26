import { Memory, DataSet } from 'Types/source';

// параметры для соурса "DOCVIEW3/Attach/Button"
const _getterOptions = {
    collection: {
        enabled: false,
    },
    pc: {
        enabled: false,
    },
    quickAddPc: {
        enabled: true,
        title: 'С компьютера',
        icon: 'icon-small icon-TFComputer',
        last: true,
    },
    buffer: {
        templateOptions: {
            folders: false,
            links: false,
        },
    },
    documents: {
        enabled: false,
    },
    videomessage: {
        enabled: false,
    },
    webcam: {
        enabled: false,
    },
    company: {
        enabled: false,
    },
    employee: {
        enabled: false,
    },
    link: {
        enabled: false,
    },
    scan: {
        templateOptions: {
            hasPDFButton: true,
        },
    },
};

function getUploadItems() {
    return import('IntegrationButtons/MenuButton').then((IntEngine) => {
        return IntEngine.getMenu({
            uid: 'OutBoxReadИсходящие',
            action: 'import',
            version: 2,
        }).addBoth(function (items) {
            return items;
        });
    });
}

/**
 * Источник данных для Controls-Actions/commands:Upload
 * @author Клепиков И.А.
 */

export default class UploadSource extends Memory {
    protected _uploadItems: Record<string, any>[];

    constructor(cfg) {
        super(cfg);
        this._uploadItems = null;
    }

    getItems() {
        if (this._uploadItems) {
            return Promise.resolve(this._uploadItems);
        }
        return getUploadItems()
            .then((items) => {
                this._uploadItems = items;
                return items;
            })
            .catch(() => {
                this._uploadItems = [];
                return [];
            });
    }

    query(query) {
        // грузим все пункты
        return this.getItems().then((items) => {
            const filter = query.getWhere();
            const filteredItems = items.filter((item) => {
                if (filter.id?.length) {
                    return item.id === filter.id[0];
                }
                if (filter.title) {
                    return item.title.indexOf(filter.title) !== -1;
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

export {getUploadItems};

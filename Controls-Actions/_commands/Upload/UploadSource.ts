import { DataSet, Memory } from 'Types/source';
import { Record } from 'Types/entity';
import { constants } from 'Env/Env';

function uploadCallback(uploadData) {
    const items = uploadData.map(function (file) {
        file.name = file.fileName;
        file['ИдентификаторДискДокумент'] = file.attachId;
        file['ИдентификаторДискВерсияДокумента'] = file.versionId;
        return {
            name: file.fileName,
            size: file.size,
            storageResponse: {
                fileId: file.attachId,
                versionId: file.versionId,
                href: file.url,
            },
        };
    });
    import('FileLoader/Loader').then((FileLoader) => {
        const record = new Record({
            adapter: 'adapter.sbis',
            format: [
                {
                    name: 'IsNeedFilePrepare',
                    type: 'boolean',
                },
                {
                    name: 'IsQRScanRequired',
                    type: 'boolean',
                },
            ],
        });
        record.set({
            IsQRScanRequired: true,
            IsNeedFilePrepare: !constants.modules.PersonalOffice,
        });
        new FileLoader({ record }).load(items);
    });
}

function getFileAttach() {
    return import('DOCVIEW3/fileAttach').then(
        ({ FileAttach, FileSystem, Scan, SbisBuffer, MobileDevice }) => {
            // Создаем экземпляр FileAttach
            return new FileAttach({
                iconSize: 'm',
                multiselect: true,
                onUpload: uploadCallback,
            })
                .useSource(FileSystem, {
                    opener: null,
                    parent: null,
                    notifyCloseOnClick: true,
                    useNativeWindow: false,
                })
                .useSource(SbisBuffer, {
                    opener: null,
                    urls: false,
                    allowAttachFolders: false,
                    allowAttachLinks: false,
                    defaultAttachMode: 'Copy',
                    disalbeAttachModeSwitcher: true,
                })
                .useSource(MobileDevice, {
                    opener: null,
                })
                .useSource(Scan, {
                    opener: null,
                    hasPDFButton: true,
                })
                .useUploader('DOCVIEW3/Uploader/SbisDisk', { catalog: 'temp' });
        }
    );
}

function getUploadItems() {
    const fileAttachPromise = getFileAttach().then((buttonAttach) => {
        const menuItems = buttonAttach.getMenuItems() || [];
        return menuItems.map((item) => {
            return {
                ...item,
                doNotSaveToHistory: true,
                itemTemplate: item.template,
            };
        });
    });
    const intEnginePromise = import('IntegrationButtons/MenuButton').then((IntEngine) => {
        return IntEngine.getMenu({
            uid: 'OutBoxReadИсходящие',
            action: 'import',
            version: 2,
        }).addBoth(function (items) {
            return items;
        });
    });
    return Promise.all([fileAttachPromise, intEnginePromise]).then(
        ([fileAttachItems, intEngineItems]) => {
            return fileAttachItems.concat(intEngineItems);
        }
    );
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

export { getUploadItems, getFileAttach };

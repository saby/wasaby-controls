import { Record } from 'Types/entity';

/**
 * Действие открытия окна загрузки файла.
 *
 * @public
 */
export default class UploadFile {
    execute(): void {
        import('FileLoader/Loader').then((Loader) => {
            const record = new Record({
                adapter: 'adapter.sbis',
                format: [
                    {
                        name: 'IsNeedFilePrepare',
                        type: 'boolean',
                    },
                ],
            });
            record.set('IsNeedFilePrepare', true);
            new Loader({ record }).choose();
        });
    }
}

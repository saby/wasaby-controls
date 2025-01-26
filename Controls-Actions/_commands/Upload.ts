import { Record } from 'Types/entity';
import { Control } from 'UI/Base';
import { IContextValue } from 'Controls/context';
import { constants } from 'Env/Env';

/**
 * Действие загрузки в систему по разным регламентам.
 * @public
 */
export default class Upload {
    // загрузка файла
    _callFileChooser(): void {
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
            new FileLoader({ record }).choose();
        });
    }

    execute({ item }: unknown, initiator: Control, _, contextData: IContextValue): void {
        if (!item || item.id === 'quickAddPc') {
            // отдельно выбор файла
            this._callFileChooser();
        } else if (item.integration) {
            // пункты интеграции
            import('IntegrationButtons/MenuButton').then((IntEngine) => {
                IntEngine.onActivated(item);
            });
        } else {
            // TODO после выделения статичных методов у DOCVIEW3/AttachButton/Source
            // зовется обработчик клика у DOCVIEW3/AttachButton/Source
            // _notify('uploadClick', [item], { bubbling: true });
        }
    }
}

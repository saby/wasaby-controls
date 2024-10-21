import { Control } from 'UI/Base';
import { Record } from 'Types/entity';
/**
 * Действие создания доверенности
 *
 * @public
 */
export default class CreatePowerOfAttorneyInv {
    execute(): void {
        const meta = {
            key: null,
            record: null,
            rule: null
        };
        let createRecord = null;
        const popupOptions = {
            template: 'PowerOfAttorneyInventory/dialog:Dialog',
            templateOptions: {
                hasExtraFields: true,
                dialogOptions: {isNewRecord: true}
            },
            opener: this,
            width: 700,
            openMode: 4,
            showOnControlsReady: true,
            eventHandlers: {
                onResult: (res: {
                    formControllerEvent: string;
                    record: Record
                }) => {
                    const {formControllerEvent, record} = res;
                    if (formControllerEvent === 'update' && record && !createRecord) {
                        createRecord = record;
                    }
                }
            }
        };

        import('EDO3/opener').then(({ Dialog }) => {
            new Dialog().open(
                meta, popupOptions
            );
        });
    }
}

import { IContextData, findObject } from '../utils';
import { Control } from 'UI/Base';

/**
 * Действие видеозвонка.
 *
 * @public
 */
export default class VideoCall {
    execute(cfg: object, initiator: Control, _, contextData: IContextData): void {
        const documentContext = findObject(contextData, 'document');
        let params = {
            data: {
                counters: [],
            },
        };
        if (documentContext) {
            const record = documentContext.get('record');
            const documentId = record?.get('ИдентификаторДокумента');
            params = {
                ...params,
                templateOptions: {
                    documentId,
                },
            };
        }
        import('Telephony_online/informer').then(({ CallsController }) =>
            CallsController.open(params)
        );
    }
}

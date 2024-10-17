import { IContextData, findObject } from '../utils';
import { Control } from 'UI/Base';

/**
 * Действие создания сообщения
 *
 * @public
 */
export default class CreateMessage {
    execute(cfg: object, initiator: Control, _, contextData: IContextData): void {
        import('Message/Theme/Stack').then((messageStack) => {
            const documentContext = findObject(contextData, 'documentContext');
            let params = {
                opener: initiator,
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
            return messageStack.open(params);
        });
    }
}

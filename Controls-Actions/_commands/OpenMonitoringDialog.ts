import { IContextData, findObject } from '../utils';
import { Control } from 'UI/Base';

/**
 * Действие открытия диалога "На контроль" в документе
 *
 * @public
 */
export default class OpenMonitoringDialog {
    execute(cfg: object, initiator: Control, _, contextData: IContextData): void {
        const documentContext = findObject(contextData, 'documentContext');
        if (documentContext) {
            const record = documentContext.get('record');
            import('EDO3/Actions/Storage/showNewMonitoringDialog').then((action) => {
                return action.default({
                    record
                });
            });
        }
    }
}

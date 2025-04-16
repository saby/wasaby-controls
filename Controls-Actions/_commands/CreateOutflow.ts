import { IContextValue } from 'Controls/context';
import { Control } from 'UI/Base';

/**
 * Действие создания реализации
 * @author Рыльский Иван Александрович
 * @public
 */
export default class CreateOutflow {
    execute(params: object, initiator: Control, _, contextData: IContextValue): void {
        import('WHD/Widgets/commands').then(({ createOutflow }): void => {
            createOutflow(params, initiator, contextData);
        });
    }
}

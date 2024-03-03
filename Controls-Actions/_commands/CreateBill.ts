import { IContextValue } from 'Controls/context';
import { Control } from 'UI/Base';

/**
 * Действие создания исходящего счета
 * @author Рыльский Иван Александрович
 * @public
 */
export default class CreateOutBill {
    execute(params: object, initiator: Control, _, contextData: IContextValue): void {
        import('WHD/Widgets/commands').then(({ createOutBill }): void => {
            createOutBill(params, initiator, contextData);
        });
    }
}

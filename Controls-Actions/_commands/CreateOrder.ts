import { Control } from 'UI/Base';
import { IContextValue } from 'Controls/context';

/**
 * Действие создания наряда
 * @author Ганжа Алексей Юрьевич
 * @public
 */
export default class CreateOrder {
    execute(params: object, initiator: Control, _, contextData: IContextValue): void {
        import('WHD/Widgets/commands').then(({ createOrder }): void => {
            createOrder(params, initiator, contextData);
        });
    }
}

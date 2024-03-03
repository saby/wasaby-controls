import { Control } from 'UI/Base';

/**
 * Действие создания наряда
 * @author Ганжа Алексей Юрьевич
 * @public
 */
export default class CreateOrder {
    execute(params: object, initiator: Control): void {
        import('WHD/Widgets/commands').then(({ createOrder }): void => {
            createOrder(params, initiator);
        });
    }
}

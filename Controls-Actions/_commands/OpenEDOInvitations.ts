import { Control } from 'UI/Base';
import { StackOpener } from 'Controls/popup';

/**
 * Интерфейс, обозначающий открытие карточки без выбранного оператора.
 *
 * @interface Controls-Actions/commands:OpenEDOInvitations#IOpenWithoutSelectedOperator
 * @private
 */
interface IOpenWithoutSelectedOperator {
    notSelectedOperator: boolean;
}

/**
 * Действие, открывающее карточку для отправления прилашений к ЭДО.
 *
 * @public
 */
export default class OpenEDOInvitations {
    execute(commandsOptions: IOpenWithoutSelectedOperator, initiator: Control): void {
        import('EDOInvitations/invitation').then(
            (invitation) => {
                if (invitation) {
                    const stackOpener = new StackOpener();
                    invitation.openStack(stackOpener, initiator, commandsOptions);
                }
            },
            (err) => {
                import('Env/Env').then((Env) => {
                    Env.IoC.resolve('ILogger').error(
                        'Controls-Actions/commands:OpenEDOInvitations - ошибка при загрузке EDOInvitations/invitation:StackNew: ',
                        err
                    );
                });
            }
        );
    }
}

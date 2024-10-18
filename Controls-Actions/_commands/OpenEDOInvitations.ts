import { Control } from 'UI/Base';
import { StackOpener } from 'Controls/popup';

/**
 * Интерфейс опций для карточки приглашения
 *
 * @interface Controls-Actions/commands:OpenEDOInvitations#IInvitationCard
 * @private
 */
interface IInvitationCard{
    onlyToRoaming: boolean;
}

/**
 * Действие, открывающее карточку для отправления прилашений к ЭДО.
 *
 * @public
 */
export default class OpenEDOInvitations {
    execute(commandsOptions: IInvitationCard, initiator: Control): void {
        import('EDOInvitationCard/card').then(
            ({ openStack }) => {
                const stackOpener = new StackOpener();
                openStack?.(stackOpener, initiator, commandsOptions);
            },
            (err) => {
                import('Env/Env').then(({ IoC }) => {
                    IoC.resolve('ILogger').error(
                        'Controls-Actions/commands:OpenEDOInvitations - ошибка при загрузке библиотеки EDOInvitationCard/card: ',
                        err
                    );
                });
            }
        );
    }
}

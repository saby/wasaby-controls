import { Control } from 'UI/Base';

interface IOptions {
    filter: object;
}

/**
 * Действие открытия диалога ЭДО.
 *
 * @public
 */
export default class OpenEDODialog {
    execute(filter: IOptions, initiator: Control): void {
        // eslint-disable-next-line ui-modules-dependencies
        import('EDO3/opener').then(
            ({ Dialog: OpenerDialog }) => {
                const meta = {
                    filter,
                };
                const popupOptions = {
                    opener: initiator,
                };
                new OpenerDialog().open(meta, popupOptions);
            },
            (err) => {
                import('Env/Env').then((Env) => {
                    Env.IoC.resolve('ILogger').error(
                        'Controls-Actions/commands:OpenEDODialog - ошибка при загрузки EDO3/opener:Dialog: ',
                        err
                    );
                });
            }
        );
    }
}

/* eslint-disable */
// @ts-nocheck

/**
 * Действие открытия чата поддержки СБИС.
 *
 * @public
 */
export default class OpenSupportChat {
    execute(): void {
        const options = {
            opener: null,
            isRetail: false,
            indicator: null,
            startText: null,
            doNotStartNewChat: true
        };
        import('Consultant/opener').then(
            ({ Chat }) => {
                if (Chat) {
                    Chat.openSupportChannel(options);
                }
            },
            (err) => {
                import('Env/Env').then((Env) => {
                    Env.IoC.resolve('ILogger').error(
                        'Controls-Actions/commands:openSupportChat - ошибка при загрузке Consultant/opener:Chat ',
                        err
                    );
                });
            }
        );
    }
}
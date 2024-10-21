/**
 * Действие задания вопроса
 *
 * @public
 */
export default class AskQuestion {
    execute(): void {
        // eslint-disable-next-line ui-modules-dependencies
        import('Consultant/opener').then(({ Chat }) => {
            Chat.openPopup('c7dbfb04-e789-4a20-bfcd-05b15d15ea5e');
        });
    }
}

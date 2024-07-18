/**
 * Действие создания новости
 *
 * @public
 */
export default class CreateNews {
    execute(_: object, initiator: HTMLElement): void {
        // eslint-disable-next-line ui-modules-dependencies
        import('News/VDom/RecipientsChoice/StaticOpener').then(({ open }) => {
            open({ target: initiator });
        });
    }
}
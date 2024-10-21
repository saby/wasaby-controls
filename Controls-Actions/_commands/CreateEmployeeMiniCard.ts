/**
 * Действие создания пользователя через мини-карточку
 *
 * @public
 */
export default class CreateEmployeeMiniCard {
    execute(): void {
        import('Employee/opener').then(({create}) => {
            create({
                newMiniCard: true
            });
        });
    }
}

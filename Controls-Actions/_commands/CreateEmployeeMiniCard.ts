/**
 * Действие создания пользователя через мини-карточку
 *
 * @public
 */
export default class CreateEmployeeMiniCard {
    execute(): void {
        import('PersonCard/card').then(({Opener}) => {
            return Opener.openEmployee({
                miniCardOptions: {
                    organizationId: -2,
                    mode: 'create'
                },
                newMiniCard: true
            });
        });
    }
}

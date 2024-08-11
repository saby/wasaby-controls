/**
 * Действие создания заметки
 *
 * @public
 */
export default class CreateNote {
    execute(): void {
        // eslint-disable-next-line ui-modules-dependencies
        import('Lib/Control/LayerCompatible/LayerCompatible')
            .then((Layer) => {
                return Promise.all([
                    import('Env/Event'),
                    new Promise((resolve) => {
                        Layer.load().addCallback(resolve);
                    }),
                ]);
            })
            .then(([EnvEvent, _]) => {
                return EnvEvent.Bus.channel('ChannelUserAccount').notify('onAddNote');
            });
    }
}

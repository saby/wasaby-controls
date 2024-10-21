import { Control } from 'UI/Base';

interface ICreateClientOptions {
    eventType: number;
    planedEvent: boolean;
}
/* eslint-disable ui-modules-dependencies */
/**
 * Действие создания события
 *
 * @public
 */
export default class CreateEvent {
    execute({ eventType, planedEvent }: ICreateClientOptions, initiator: Control): void {
        import('Lib/Control/LayerCompatible/LayerCompatible')
            .then((Layer) => {
                return Promise.all([
                    import('CRM/Tools/DialogManager'),
                    new Promise((resolve) => {
                        Layer.load().addCallback(resolve);
                    }),
                ]);
            })
            .then(([DialogManager, _]) => {
                DialogManager.open('EventWasaby', {
                    opener: initiator,
                    kind: Number(planedEvent),
                    type: eventType,
                });
            });
    }
}
/* eslint-enable ui-modules-dependencies */

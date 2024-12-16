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
    execute({ eventType, planedEvent }: ICreateClientOptions, initiator: Control, element: HTMLElement, context: object): void {
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
                const document = context?.documentContext?.get('record');
                DialogManager.open('EventWasaby', {
                    opener: initiator,
                    kind: Number(planedEvent),
                    type: eventType,
                    clientId: document?.get('Contractor')?.get('Id'),
                    themeId: document?.get('Regulation')?.get('Id'),
                    documentId: document?.get('Id'),
                    hideLinkedDocument: !!document?.get('Id'),
                });
            });
    }
}
/* eslint-enable ui-modules-dependencies */

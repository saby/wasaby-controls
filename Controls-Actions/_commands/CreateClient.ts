import { Control } from 'UI/Base';
import { TClient } from './CreateClient/ClientTypeEditor';

interface ICreateClientOptions {
    clientType: TClient;
}

type TContractor = {
    openDialog(cfg: { opener: Control; isEntrepreneur: boolean }): void;
};
/* eslint-disable ui-modules-dependencies */
/**
 * Действие создания клиента
 *
 * @public
 */
export default class CreateClient {
    execute({ clientType }: ICreateClientOptions, initiator: Control): void {
        import('Lib/Control/LayerCompatible/LayerCompatible')
            .then((Layer) => {
                return new Promise((resolve) => {
                    Layer.load().addCallback(resolve);
                });
            })
            .then(() => {
                if (clientType === 'Физическое лицо') {
                    import('CRM/Tools/DialogManager').then((DialogManager) => {
                        DialogManager.open('Client', {
                            opener: initiator,
                            linkToOpener: false,
                            componentOptions: { editing: true },
                        });
                    });
                } else {
                    import('CRM/Tools/Openers/Contractor').then((Contractor: TContractor) => {
                        Contractor.openDialog({
                            opener: initiator,
                            isEntrepreneur: clientType === 'ИП',
                        });
                    });
                }
            });
    }
}
/* eslint-enable ui-modules-dependencies */

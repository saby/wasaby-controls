import { Control } from 'UI/Base';
import { createFilter } from './Utils';

interface ICreateOutgoingPaymentOptions {
    docType: string;
    id?: string;
}

/**
 * Действие создания исходящего платежа
 *
 * @public
 */
export default class CreateOutgoingPayment {
    execute({ docType, id }: ICreateOutgoingPaymentOptions, initiator: Control): void {
        Promise.all([import('EDO3/opener')]).then(([{ Dialog }]) => {
            const meta: { [key: string]: string | object } = {
                nameDialog: '',
                objectName: docType,
                groupType: docType,
            };
            const filter = createFilter(meta, id);
            new Dialog().open(
                {
                    filter,
                    rule: null,
                },
                {
                    opener: initiator,
                    openMode: 4,
                }
            );
        });
    }
}

import { Control } from 'UI/Base';

interface ITransportOptions {
    item: {
        meta: {
            filter: object;
        };
    };
}

/**
 * Создание документов связанных с Транспортом
 *
 * @public
 */
export default class Transport {
    execute({ item }: ITransportOptions, initiator: Control): void {
        if (item) {
            Promise.all([import('EDO3/opener')]).then(([{ Dialog }]) => {
                new Dialog().open(
                    {
                        filter: item.meta.filter,
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
}

import { Control } from 'UI/Base';

interface IDocOptions {
    item: {
        meta: {
            filter: object;
        };
    };
}

/**
 * Создание документов
 *
 * @public
 */
export default class Doc {
    execute({ item }: IDocOptions, initiator: Control): void {
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

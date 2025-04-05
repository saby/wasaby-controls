import { Control } from 'UI/Base';
import { Query, SbisService } from 'Types/source';
import { Record as TRecord } from 'Types/entity';

/**
 * Действие создания списка
 *
 * @public
 */

export default class CreateList {
    execute(cfg: object, initiator: Control): void {
        new Promise((resolve) => {
            const item = new SbisService({
                endpoint: 'Regulation',
                binding: { query: 'StdList' },
            }).query(
                new Query().where(
                    TRecord.fromObject(
                        {
                            DocType: ['ClientsList'],
                        },
                        'adapter.sbis'
                    )
                )
            );
            resolve(item);
        }).then((item) => {
            // eslint-disable-next-line ui-modules-dependencies
            import('EDO3/opener').then((EDO3Opener) => {
                const edo3Opener = new EDO3Opener.Dialog();
                const meta = {
                    rule: item.getAll().at(0),
                };
                const popupOptions = {
                    opener: initiator,
                    openMode: 4,
                };
                edo3Opener.open(meta, popupOptions);
            });
        });
    }
}

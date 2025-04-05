/**
 * Действие создания документа ПиВ
 * @class Controls-Actions/_commands/CreateMotivationDoc
 * @author Ефимов К.А.
 * @public
 */

import { Model } from 'Types/entity';

export default class CreateMotivationDoc {
    async execute({ regulation, type }: object): Promise<void> {
        const [regId, id] = regulation.split(':');
        const motivate = await import('Motivation/Operations/Motivate');
        return motivate.default.encourage(
            this,
            new Model({
                keyProperty: 'Regulation',
                rawData: {
                    Type: type,
                    Regulation: regId,
                    Id: id,
                },
            })
        );
    }
}

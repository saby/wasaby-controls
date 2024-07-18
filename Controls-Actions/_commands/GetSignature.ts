import { Control } from 'UI/Base';

/**
 * Действие получения электронной подписи
 *
 * @public
 */
export default class GetSignature {
    execute(_: object, initiator: Control): void {
        // eslint-disable-next-line ui-modules-dependencies
        import('CACore/utils').then((CACore) => {
            CACore.createPetition({ opener: initiator });
        });
    }
}

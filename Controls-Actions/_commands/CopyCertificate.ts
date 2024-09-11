import { Control } from 'UI/Base';

/**
 * Действие копирования сертификата
 *
 * @public
 */
export default class CopyCertificate {
    execute(_: object, initiator: Control): void {
        // eslint-disable-next-line ui-modules-dependencies
        import('CACore/Certificate').then((certificate) => {
            certificate.copy(initiator, false);
        });
    }
}

import { Control } from 'UI/Base';

/**
 * Действие создания сущностей отеля
 *
 * @public
 */
export default class CreateHotelEntity {
    execute(config: { entityType: string }, initiator: Control): void {
        // eslint-disable-next-line ui-modules-dependencies
        import('Hotel/Common/addButton').then(({ createBookingEntity }) => {
            createBookingEntity(config.entityType, initiator);
        });
    }
}

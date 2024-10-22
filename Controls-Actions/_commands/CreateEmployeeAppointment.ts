import { Control } from 'UI/Base';

interface ICreateEmployeeAppointmentOptions {
    queueInfo: { Owner: string };
}

/**
 * Действие создания записи к сотруднику
 *
 * @public
 */
export default class CreateEmployeeAppointment {
    execute({ queueInfo }: ICreateEmployeeAppointmentOptions, initiator: Control): void {
        const personUUID = queueInfo?.Owner;
        if (personUUID) {
            // eslint-disable-next-line ui-modules-dependencies
            import('BookingPublic/employeeQueueCalendar').then((lib) => {
                lib.open({
                    opener: initiator,
                    personUUID
                });
            });
        }
    }
}

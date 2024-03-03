import { TRegulation } from './CreateMeeting/MeetingRegulationEditor';

interface ICreateMeetingOptions {
    regulation: TRegulation;
}

/**
 * Действие создания совещания
 *
 * @public
 */
export default class CreateMeeting {
    execute({ regulation }: ICreateMeetingOptions): void {
        // eslint-disable-next-line ui-modules-dependencies
        import('Events/MeetingCardWasaby/Utils/PublicUtils').then((PublicUtils) => {
            PublicUtils.createMeetingCard({
                createMetaData: {
                    Type: regulation === 'video' ? 1 : 0,
                },
            });
        });
    }
}

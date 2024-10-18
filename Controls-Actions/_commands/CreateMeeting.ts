/**
 * Действие создания совещания
 *
 * @public
 */
export default class CreateMeeting {
    execute(): void {
        // eslint-disable-next-line ui-modules-dependencies
        import('Events/MeetingCardWasaby/Utils/PublicUtils').then((PublicUtils) => {
            PublicUtils.createMeetingCard({
                createMetaData: {
                    Type: 0,
                },
            });
        });
    }
}

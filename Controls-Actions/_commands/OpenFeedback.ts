/* eslint-disable */
// @ts-nocheck

/**
 * Действие открытия обратной связи.
 *
 * @public
 */
export default class OpenFeedback {
    execute({ widget }): void {
        if (widget) {
            import('optional!Consultant/opener').then(({ Feedback }) => {
                Feedback.openPopup({ channel: widget.UUID, source: 'socnet' });
            });
        }
    }
}

/**
 * @kaizen_zone 4fea624e-a13f-4100-abef-b3cc202a31ad
 */
import * as React from 'react';
import { createElement } from 'UICore/Jsx';
import { Decorator as Markup } from 'Controls/markup';

export default function Message(props): React.ReactElement {
    const getContentTemplate = (): React.ReactElement => {
        if (props.hasMarkup) {
            return createElement(Markup, {
                value: props.content,
                messageOptions: props.messageOptions,
            });
        }
        return createElement(props.content, {
            messageOptions: props.messageOptions,
        });
    };
    return (
        <div
            className={`controls-ConfirmationDialog__message
            ${
                props.hasDetails
                    ? 'controls-ConfirmationDialog__message_withDetails'
                    : ''
            }`}
            data-qa="controls-ConfirmationDialog__message"
        >
            <div className="controls-ConfirmationDialog__message-centered">
                {getContentTemplate()}
            </div>
        </div>
    );
}

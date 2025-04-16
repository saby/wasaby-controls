/**
 * @kaizen_zone 4eca12bb-c964-409a-b853-a3803e6a37a3
 */
import * as React from 'react';
import MarkupMessage from './MarkupMessage';

export default function Message(props): React.ReactElement {
    const getContentTemplate = (): React.ReactElement => {
        if (props.hasMarkup) {
            return <MarkupMessage content={props.content} />;
        }
        return typeof props.content === 'string' ? (
            props.content
        ) : (
            <props.content messageOptions={props.messageOptions} />
        );
    };
    return (
        <div
            className={`controls-ConfirmationDialog__message
            ${props.hasDetails ? 'controls-ConfirmationDialog__message_withDetails' : ''}`}
            data-qa="controls-ConfirmationDialog__message"
        >
            <div className="controls-ConfirmationDialog__message-centered">
                {getContentTemplate()}
            </div>
        </div>
    );
}

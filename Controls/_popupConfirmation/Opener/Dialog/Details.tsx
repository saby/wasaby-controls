/**
 * @kaizen_zone 4eca12bb-c964-409a-b853-a3803e6a37a3
 */
import * as React from 'react';

export default function Details(props): React.ReactElement {
    const getContentTemplate = (): React.ReactElement => {
        return typeof props.content === 'string' ? (
            props.content
        ) : (
            <props.content {...props.detailsOptions} />
        );
    };
    return (
        <div
            className="controls-ConfirmationDialog__details"
            data-qa="controls-ConfirmationDialog__details"
        >
            <div className="controls-ConfirmationDialog__message-centered">
                {getContentTemplate()}
            </div>
        </div>
    );
}

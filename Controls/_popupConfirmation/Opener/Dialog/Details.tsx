/**
 * @kaizen_zone 4fea624e-a13f-4100-abef-b3cc202a31ad
 */
import * as React from 'react';

export default function Details(props): React.ReactElement {
    const getContentTemplate = (): React.ReactElement => {
        return typeof props.content === 'string' ? props.content : <props.content {...props.detailsOptions}/>;
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

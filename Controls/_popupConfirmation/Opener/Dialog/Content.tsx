/**
 * @kaizen_zone 4fea624e-a13f-4100-abef-b3cc202a31ad
 */
import * as React from 'react';
import { createElement } from 'UICore/Jsx';

export default function Content(props): React.ReactElement {
    const getMessageTemplate = (): React.ReactElement => {
        return createElement(props.messageTemplate, {
            hasDetails: props.details,
            content: props.message,
            messageOptions: props.messageOptions,
            hasMarkup: props.hasMarkup,
        });
    };

    const getDetailsTemplate = (): React.ReactElement => {
        return createElement(props.detailsTemplate, {
            content: props.details,
            detailsOptions: props.detailsOptions,
        });
    };
    return (
        <>
            <div>{props.message && getMessageTemplate()}</div>
            <div>{props.details && getDetailsTemplate()}</div>
        </>
    );
}

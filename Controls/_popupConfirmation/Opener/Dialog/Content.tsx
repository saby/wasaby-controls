/**
 * @kaizen_zone 4fea624e-a13f-4100-abef-b3cc202a31ad
 */
import * as React from 'react';

export default function Content(props): React.ReactElement {
    const getMessageTemplate = (): React.ReactElement => {
        const messageTemplateProps = {
            hasDetails: props.details,
            content: props.message,
            messageOptions: props.messageOptions,
            hasMarkup: props.hasMarkup
        };
        return <props.messageTemplate {...messageTemplateProps}/>;
    };

    const getDetailsTemplate = (): React.ReactElement => {
        const detailsTemplateProps = {
            content: props.details,
            detailsOptions: props.detailsOptions
        };
        return <props.detailsTemplate {...detailsTemplateProps}/>;
    };
    return (
        <>
            <div>{props.message && getMessageTemplate()}</div>
            <div>{props.details && getDetailsTemplate()}</div>
        </>
    );
}

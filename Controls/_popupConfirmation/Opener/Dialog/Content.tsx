/**
 * @kaizen_zone 4fea624e-a13f-4100-abef-b3cc202a31ad
 */
import * as React from 'react';
import { Logger } from 'UICommon/Utils';

export default function Content(props): React.ReactElement {
    const getMessageTemplate = (): React.ReactElement => {
        const messageTemplateProps = {
            hasDetails: props.details,
            content: props.message || props.messageContentTemplate,
            messageOptions: props.messageOptions,
            hasMarkup: props.hasMarkup
        };
        if (typeof props.message === 'function' || props.message?.isWasabyTemplate) {
            Logger.error('Опция message имеет не верный тип, используйте опцию messageContentTemplate для отображения шаблона основного текста диалога подтверждения', this);
        }
        return <props.messageTemplate {...messageTemplateProps}/>;
    };

    const getDetailsTemplate = (): React.ReactElement => {
        const detailsTemplateProps = {
            content: props.details || props.detailsContentTemplate,
            detailsOptions: props.detailsOptions
        };
        if (typeof props.details === 'function' || props.details?.isWasabyTemplate) {
            Logger.error('Опция details имеет не верный тип, используйте опцию detailsContentTemplate для отображения шаблона дополнительного текста диалога подтверждения', this);
        }
        return <props.detailsTemplate {...detailsTemplateProps}/>;
    };
    return (
        <>
            <div>{(props.message || props.messageContentTemplate) && getMessageTemplate()}</div>
            <div>{(props.details || props.detailsContentTemplate) && getDetailsTemplate()}</div>
        </>
    );
}

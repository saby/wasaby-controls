/**
 * @kaizen_zone 4eca12bb-c964-409a-b853-a3803e6a37a3
 */
import * as React from 'react';
import { Logger } from 'UICommon/Utils';

export default function Content(props): React.ReactElement {
    const getMessageTemplate = (): React.ReactElement => {
        const messageTemplateProps = {
            hasDetails: props.details || props.detailsContentTemplate,
            content: props.message || props.messageContentTemplate,
            messageOptions: props.messageOptions,
            hasMarkup: props.hasMarkup,
        };
        if (typeof props.message === 'function' || props.message?.isWasabyTemplate) {
            Logger.error(
                'Опция message имеет неверный тип, используйте опцию messageContentTemplate для отображения шаблона основного текста диалога подтверждения',
                this
            );
        }
        return <props.messageTemplate {...messageTemplateProps} />;
    };

    const getDetailsTemplate = (): React.ReactElement => {
        const detailsTemplateProps = {
            content: props.details || props.detailsContentTemplate,
            detailsOptions: props.detailsOptions,
        };
        if (typeof props.details === 'function' || props.details?.isWasabyTemplate) {
            Logger.error(
                'Опция details имеет неверный тип, используйте опцию detailsContentTemplate для отображения шаблона дополнительного текста диалога подтверждения',
                this
            );
        }
        return <props.detailsTemplate {...detailsTemplateProps} />;
    };
    return (
        <>
            <div>{(props.message || props.messageContentTemplate) && getMessageTemplate()}</div>
            <div>{(props.details || props.detailsContentTemplate) && getDetailsTemplate()}</div>
        </>
    );
}

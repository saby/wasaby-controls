/**
 * @kaizen_zone 6ccf0789-a238-4656-86f6-d0eff65e12f9
 */
import * as React from 'react';
import { InfoBox, IInfoboxTemplateOptions } from 'Controls/popupTemplate';
import 'css!Controls/hintManagerPopup';

interface IMessageOptions extends IInfoboxTemplateOptions {
    message: string;
}

/**
 * Окно подсказки с простым текстом.
 * @class Controls/_hintManagerPopup/Message
 * @public
 */
function Message(
    props: IMessageOptions,
    ref
): React.ReactElement {
    return (
        <InfoBox
            { ...props }
            content={(
                <div ref={ ref } className="controls-HintManagerPopupMessage controls-padding-s">
                    { props.message }
                </div>
            )}
        />
    );
}

const _ = React.forwardRef(Message);

// FIXME: https://online.sbis.ru/doc/e36e1911-c765-4f54-a93c-0beebd663c72?client=3
_.isReact = true;

export default _;

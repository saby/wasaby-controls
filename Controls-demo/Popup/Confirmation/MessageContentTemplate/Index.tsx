import { forwardRef } from 'react';
import { Button } from 'Controls/buttons';
import { Confirmation } from 'Controls/popup';
import MessageTemplateReact from './MessageTemplateReact';

export default forwardRef(function ConfirmationMessageTemplate(_, ref) {
    const buttons = [
        {
            caption: 'Да',
            value: true,
            buttonStyle: 'primary',
        },
        {
            caption: 'Нет',
            value: false,
        },
    ];
    return (
        <div ref={ref} className="ws-flexbox ws-justify-content-center">
            <div>
                <div className="controls-text-label">messageContentTemplate(ReactElement)</div>
                <Button
                    caption="Открыть"
                    onClick={(e) => {
                        Confirmation.openPopup({
                            buttons,
                            messageContentTemplate: MessageTemplateReact,
                            messageOptions: {
                                text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
                            },
                        });
                    }}
                />
            </div>
        </div>
    );
});

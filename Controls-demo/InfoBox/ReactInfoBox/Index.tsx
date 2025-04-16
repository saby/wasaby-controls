import { Button } from 'Controls/buttons';
import { IInfoBoxPopupOptions, InfoBoxContext } from 'Controls/popup';
import { SyntheticEvent } from 'UICommon/Events';
import * as React from 'react';

export default React.forwardRef((_, ref: React.ForwardedRef<HTMLDivElement>) => {
    const infoboxContext = React.useContext(InfoBoxContext);
    const infoboxTargetRef = React.useRef<HTMLElement | null>(null);

    const openInfoBox = () => {
        const config: IInfoBoxPopupOptions = {
            opener: this,
            target: infoboxTargetRef.current,
            message: "Это сообщение из infobox'а",
            maxWidth: 400,
        };

        const event = new SyntheticEvent(null, {
            target: infoboxTargetRef.current,
            type: 'openInfoBox',
        });

        infoboxContext.onOpenInfoBox(event, config);
    };

    return (
        <div ref={ref} className="tw-flex controls-margin_left-m controls-margin_top-m">
            <div>Нажмите на кнопку</div>
            <Button
                ref={infoboxTargetRef}
                viewMode="linkButton"
                fontColorStyle="link"
                icon="icon-EmptyMessage"
                iconSize="m"
                iconStyle="secondary"
                onClick={openInfoBox}
            />
        </div>
    );
});

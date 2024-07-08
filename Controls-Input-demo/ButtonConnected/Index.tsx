import { forwardRef, LegacyRef } from 'react';
import { Button } from 'Controls-Input/buttonConnected';

const ACTION = {
    actionProps: {
        link: 'https://sbis.ru',
        blankTarget: true,
    },
    id: 'openLinkAction',
};

export default forwardRef(function ButtonDemo(_, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div
            className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center"
            ref={ref}
        >
            <div
                className="controlsDemo__flex ws-justify-content-center ws-align-items-center"
                data-qa="controlsDemo_capture"
            >
                <div className="controls-margin_right-m">
                    <Button caption="Кнопка" action={ACTION} />
                </div>
                <div className="controls-margin_right-m">
                    <Button
                        caption="Кнопка"
                        icon={{
                            uri: 'icon-SabyBird',
                            captionPosition: 'start',
                        }}
                        action={ACTION}
                    />
                </div>
            </div>
        </div>
    );
});

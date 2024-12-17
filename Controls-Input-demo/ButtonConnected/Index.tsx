import { forwardRef, LegacyRef } from 'react';
import { Button } from 'Controls-Input/buttonConnected';
import { query } from 'Application/Env';

export default forwardRef(function ButtonDemo(_, ref: LegacyRef<HTMLDivElement>) {
    const ACTION = {
        actionProps: {
            link: query.get.link ? query.get.link : 'https://sbis.ru',
            blankTarget: true,
        },
        id: 'openLinkAction',
    };
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

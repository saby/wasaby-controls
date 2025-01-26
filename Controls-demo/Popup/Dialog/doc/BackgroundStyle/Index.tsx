import { Dialog } from 'Controls/popupTemplate';
import { forwardRef, useCallback } from 'react';
import { Label } from 'Controls/input';
import 'css!Controls-demo/Popup/Dialog/doc/Template/Template';

function Index(props, ref) {
    const getBodyContentTemplate = useCallback(() => {
        return <div className="controlsDemo-Dialog__template">Контент внутри диалогового окна</div>;
    }, []);

    const getHeaderContentTemplate = useCallback(() => {
        return <div className="controlsDemo-Dialog__template">Контент внутри шапки окна</div>;
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '500px' }}>
                <Label caption="backgroundStyle='unaccented' headerBackgroundStyle='default'" />
                <Dialog
                    backgroundStyle="default"
                    headerBackgroundStyle="default"
                    bodyContentTemplate={getBodyContentTemplate()}
                    headerContentTemplate={getHeaderContentTemplate()}
                    className="controls-margin_bottom-m"
                />
                <Label caption="backgroundStyle='success' headerBackgroundStyle='success'" />
                <Dialog
                    backgroundStyle="success"
                    headerBackgroundStyle="success"
                    bodyContentTemplate={getBodyContentTemplate()}
                    headerContentTemplate={getHeaderContentTemplate()}
                    className="controls-margin_bottom-m"
                />
                <Label caption="backgroundStyle='unaccented' headerBackgroundStyle='default'" />
                <Dialog
                    backgroundStyle="unaccented"
                    headerBackgroundStyle="default"
                    bodyContentTemplate={getBodyContentTemplate()}
                    headerContentTemplate={getHeaderContentTemplate()}
                    className="controls-margin_bottom-m"
                />
            </div>
        </div>
    );
}

export default forwardRef(Index);

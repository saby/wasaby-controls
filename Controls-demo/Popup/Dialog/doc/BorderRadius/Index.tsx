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
                <Label caption="borderRadius='s'" />
                <Dialog
                    borderRadius="s"
                    bodyContentTemplate={getBodyContentTemplate()}
                    headerContentTemplate={getHeaderContentTemplate()}
                    className="controls-margin_bottom-m"
                />
                <Label caption="borderRadius='m'" />
                <Dialog
                    borderRadius="s"
                    bodyContentTemplate={getBodyContentTemplate()}
                    headerContentTemplate={getHeaderContentTemplate()}
                    className="controls-margin_bottom-m"
                />
                <Label caption="borderRadius='l'" />
                <Dialog
                    borderRadius="l"
                    bodyContentTemplate={getBodyContentTemplate()}
                    headerContentTemplate={getHeaderContentTemplate()}
                    className="controls-margin_bottom-m"
                />
            </div>
        </div>
    );
}

export default forwardRef(Index);

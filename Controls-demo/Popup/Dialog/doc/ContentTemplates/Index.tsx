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

    const getFooterContentTemplate = useCallback(({ className }) => {
        return (
            <div className={className}>
                <div className="controlsDemo-Dialog__template">Контент внутри подвала</div>
            </div>
        );
    }, []);

    const getImageContentTemplate = useCallback(() => {
        return <div className="controlsDemo-Dialog__template__image"></div>;
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '400px' }}>
                <Label caption="Заданы опции bodyContentTemplate, headerContentTemplate," />
                <Label caption="footerContentTemplate и imageContentTemplate" />
                <Dialog
                    imageContentTemplate={getImageContentTemplate}
                    bodyContentTemplate={getBodyContentTemplate}
                    headerContentTemplate={getHeaderContentTemplate}
                    footerContentTemplate={getFooterContentTemplate}
                    className="controls-margin_top-m"
                />
            </div>
        </div>
    );
}

export default forwardRef(Index);

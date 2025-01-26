import { Dialog } from 'Controls/popupTemplate';
import { forwardRef, useCallback } from 'react';
import { Label } from 'Controls/input';
import 'css!Controls-demo/Popup/Dialog/doc/Template/Template';

function Index(props, ref) {
    const getBodyContentTemplate = useCallback(() => {
        return <div className="controlsDemo-Dialog__template">Контент внутри диалогового окна</div>;
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '400px' }}>
                <Label caption="Настройка заголовка" />
                <Label caption="headingCaption='Заголовок текста'" />
                <Label caption="headingFontColorStyle='primary'" />
                <Label caption="headingFontSize='l'" />
                <Label caption="headingFontWeight='bold'" />
                <Dialog
                    headingCaption="Заголовок текста"
                    headingFontColorStyle="primary"
                    headingFontSize="xl"
                    headingFontWeight="bold"
                    bodyContentTemplate={getBodyContentTemplate()}
                    className="controls-margin_top-m"
                />
            </div>
        </div>
    );
}

export default forwardRef(Index);

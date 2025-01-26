import { useCallback, forwardRef } from 'react';
import { Dialog } from 'Controls/popupTemplate';
import 'css!Controls-demo/Popup/Dialog/doc/Template/Template';

function Template(props) {
    const getBodyContentTemplate = useCallback(() => {
        return <div className="controlsDemo-Dialog__template">Контент внутри диалогового окна</div>;
    }, []);

    const getHeadingCaption = useCallback(() => {
        return <div className="controlsDemo-Dialog__template">Контент внутри шапки окна</div>;
    }, []);
    return (
        <Dialog
            {...props}
            bodyContentTemplate={getBodyContentTemplate()}
            headingCaption={'Контент внутри шапки окна'}
        />
    );
}

export default forwardRef(Template);

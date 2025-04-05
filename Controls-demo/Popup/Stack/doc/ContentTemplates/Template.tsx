import { useCallback, forwardRef } from 'react';
import { Stack } from 'Controls/popupTemplate';
import 'css!Controls-demo/Popup/Stack/doc/Template/Template';

function Template(props) {
    const getBodyContentTemplate = useCallback(() => {
        return <div className="controlsDemo-Stack__template">Контент внутри стекового окна</div>;
    }, []);

    const getHeaderContentTemplate = useCallback(() => {
        return <div className="controlsDemo-Stack__template">Контент внутри шапки окна</div>;
    }, []);

    const getFooterContentTemplate = useCallback(({ className }) => {
        return (
            <div className={className}>
                <div className="controlsDemo-Stack__template">Контент внутри подвала</div>
            </div>
        );
    }, []);

    const getImageContentTemplate = useCallback(() => {
        return <div className="controlsDemo-Stack__template__image"></div>;
    }, []);
    return (
        <Stack
            {...props}
            bodyContentTemplate={getBodyContentTemplate}
            headerContentTemplate={getHeaderContentTemplate}
            footerContentTemplate={getFooterContentTemplate}
            imageContentTemplate={getImageContentTemplate}
        />
    );
}

export default forwardRef(Template);

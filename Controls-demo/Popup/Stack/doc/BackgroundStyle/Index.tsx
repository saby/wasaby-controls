import { useCallback, forwardRef } from 'react';
import { Stack } from 'Controls/popupTemplate';
import 'css!Controls-demo/Popup/Stack/doc/Template/Template';
import { Label } from 'Controls/input';

function Template(props, ref) {
    const getBodyContentTemplate = useCallback(() => {
        return <div className="controlsDemo-Stack__template">Контент внутри стекового окна</div>;
    }, []);

    const getHeaderContentTemplate = useCallback(() => {
        return (
            <div c lassName="controlsDemo-Stack__template">
                Контент внутри шапки окна
            </div>
        );
    }, []);
    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '500px' }}>
                <Label caption="backgroundStyle='default' headerBackgroundStyle='default'" />
                <Stack
                    backgroundStyle="default"
                    headerBackgroundStyle="unaccented"
                    {...props}
                    bodyContentTemplate={getBodyContentTemplate}
                    headerContentTemplate={getHeaderContentTemplate}
                    className="controls-margin_bottom-m"
                />
                <Label caption="backgroundStyle='default' headerBackgroundStyle='unaccented'" />
                <Stack
                    backgroundStyle="unaccented"
                    headerBackgroundStyle="unaccented"
                    {...props}
                    bodyContentTemplate={getBodyContentTemplate}
                    headerContentTemplate={getHeaderContentTemplate}
                />
            </div>
        </div>
    );
}

export default forwardRef(Template);

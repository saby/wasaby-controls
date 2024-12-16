import { Stack } from 'Controls/popupTemplate';
import { useCallback } from 'react';
import 'css!Controls-demo/PopupTemplate/Stack/doc/Layout/Layout';

export default function HeaderBackgroundStyle() {
    const getBodyContentTemplate = useCallback(() => {
        return <div></div>;
    }, []);

    return (
        <div className="controlsDemo-StackLayout__container">
            <Stack
                className="controlsDemo-StackLayout"
                headerBackgroundStyle="unaccented"
                backgroundStyle="default"
                bodyContentTemplate={getBodyContentTemplate()}
                headingCaption={'Заголовок шапки'}
            />
        </div>
    );
}

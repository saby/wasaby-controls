import { Stack } from 'Controls/popupTemplate';
import { useCallback } from 'react';
import 'css!Controls-demo/PopupTemplate/Stack/doc/Layout/Layout';

export default function Index() {
    const getBodyContentTemplate = useCallback(() => {
        return (
            <div className="controlsDemo-StackLayout__content__container">
                <div className="controls__block controlsDemo-StackLayout__content"></div>
                <div className="controls__block controlsDemo-StackLayout__content controls-margin_left-l"></div>
            </div>
        );
    }, []);

    return (
        <div className="controlsDemo-StackLayout__container">
            <Stack
                className="controlsDemo-StackLayout"
                backgroundStyle="unaccented"
                bodyContentTemplate={getBodyContentTemplate()}
                headingCaption={'Заголовок шапки'}
                rightBorderVisible={false}
                headerBorderVisible={false}
            />
        </div>
    );
}

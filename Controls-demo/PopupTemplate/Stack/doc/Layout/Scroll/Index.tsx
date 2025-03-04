import { Stack } from 'Controls/popupTemplate';
import { useCallback } from 'react';
import { Container } from 'Controls/scroll';
import 'css!Controls-demo/PopupTemplate/Stack/doc/Layout/Layout';

export default function Index() {
    const getBodyContentTemplate = useCallback(() => {
        return (
            <Container
                shadowMode="js"
                className="controls-Scroll-ContainerExternal-vertical controls-Scroll-ContainerExternal"
                style={{ height: '100%' }}
            >
                <div className="controlsDemo-StackLayout__content__container controls__block-wrapper tr">
                    <div className="controls__block controlsDemo-StackLayout__content"></div>
                </div>
            </Container>
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

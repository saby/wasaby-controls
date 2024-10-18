import { forwardRef } from 'react';
import { Button } from 'Controls-Input/dropdownConnected';
import { getLoadConfig } from '../../resources/_dataContextMock';

const ACTION = {
    actionProps: {
        link: 'https://sbis.ru',
        blankTarget: true,
    },
    id: 'openLinkAction',
};

const SelectorDemo = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col"
        >
            <Button
                className="controls-margin_top-m"
                caption="Кнопка"
                icon={{
                    uri: 'icon-SabyBird',
                    captionPosition: 'start',
                }}
                action={ACTION}
            />
        </div>
    );
});

SelectorDemo.getLoadConfig = getLoadConfig;

export default SelectorDemo;

import { forwardRef, LegacyRef } from 'react';
import Tabs from 'Controls-Containers/Tabs';
import { View as Tab } from 'Controls-Containers/Tab';
import { ITabsProps } from 'Controls-Containers/interface';

const variants: ITabsProps['variants'] = {
    items: [
        { id: 1, title: 'Первая вкладка', align: 'left' },
        { id: 2, title: 'Вторая вкладка', align: 'left' },
        { id: 3, title: 'Третья вкладка', align: 'left' },
    ],
    selectedKeys: [1],
};

const children = [
    <Tab>
        <div className="controls-margin-m">Содержимое для 1 вкладки</div>
    </Tab>,
    <Tab>
        <div className="controls-margin-m">Содержимое для 2 вкладки</div>
    </Tab>,
    <Tab>
        <div className="controls-margin-m">Содержимое для 3 вкладки</div>
    </Tab>,
];

export default forwardRef((_, ref: LegacyRef<HTMLDivElement>) => {
    return (
        <div
            className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center"
            ref={ref}
        >
            <div
                className="controlsDemo__flex ws-justify-content-center ws-align-items-center"
                data-qa="controlsDemo_capture"
            >
                <div className="tw-flex tw-flex-col">
                    <div className="controls-margin_bottom-m">
                        <Tabs variants={variants} children={children} viewMode="underlined" />
                    </div>
                    <div className="controls-margin_bottom-m">
                        <Tabs variants={variants} children={children} viewMode="bordered" />
                    </div>
                </div>
            </div>
        </div>
    );
});

import { forwardRef, useState } from 'react';
import { AdaptiveButtons } from 'Controls/tabs';
import { RecordSet } from 'Types/collection';

const tabs = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: '1',
            title: 'Контакты',
        },
        {
            id: '2',
            title: 'Задачи',
        },
        {
            id: '3',
            title: 'Бизнес',
        },
        {
            id: '4',
            title: 'Деньги',
        },
        {
            id: '5',
            title: 'Лучшие сотрудники',
        },
        {
            id: '6',
            title: 'Самые важные документы',
        },
        {
            id: '7',
            title: 'Очень дорогие компании',
        },
    ],
});

export default forwardRef(function MoreButton(_, ref) {
    const [selectedKey, setSelectedKey] = useState('1');
    const selectedKeyChanged = (key: string) => {
        setSelectedKey(key);
    };
    return (
        <div ref={ref} className="tw-flex ws-justify-content-center">
            <div data-qa="controlsDemo_capture">
                <div
                    style={{
                        width: '100vw',
                    }}
                >
                    <AdaptiveButtons
                        keyProperty="id"
                        selectedKey={selectedKey}
                        items={tabs}
                        onSelectedKeyChanged={selectedKeyChanged}
                        customEvents={['onSelectedKeyChanged']}
                        data-qa="Controls-demo_Tabs_AdaptiveButtons_MoreButton_auto"
                    />
                </div>
            </div>
        </div>
    );
});

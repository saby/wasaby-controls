import { forwardRef, useState } from 'react';
import { Control, tumblerItemIconTemplate } from 'Controls/Tumbler';
import { RecordSet } from 'Types/collection';

export default forwardRef((_, ref) => {
    const [items, setItems] = useState(() => {
        return new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Оправить',
                    icon: 'icon-Send',
                },
                {
                    id: '2',
                    caption: '',
                    icon: 'icon-Gift',
                },
                {
                    id: '3',
                    caption: '',
                    icon: 'icon-Health',
                },
            ],
            keyProperty: 'id',
        });
    });
    const [selectedKey, setSelectedKey] = useState('1');
    const onSelectedKeyChanged = (selectedKey) => {
        setItems(
            new RecordSet({
                rawData: [
                    {
                        id: '1',
                        caption: selectedKey === '1' ? 'Оправить' : '',
                        icon: 'icon-Send',
                    },
                    {
                        id: '2',
                        caption: selectedKey === '2' ? 'Получить' : '',
                        icon: 'icon-Gift',
                    },
                    {
                        id: '3',
                        caption: selectedKey === '3' ? 'Избранное' : '',
                        icon: 'icon-Health',
                    },
                ],
                keyProperty: 'id',
            })
        );
        setSelectedKey(selectedKey);
    };
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center"
        >
            <div
                className="controlsDemo__flex ws-flex-column ws-align-items-center ws-justify-content-center"
                data-qa="controlsDemo_capture"
            >
                <div className="controlsDemo__cell">
                    <Control
                        data-qa="controlsDemo-Tumbler__dynamicCaption"
                        items={items}
                        selectedKey={selectedKey}
                        onSelectedKeyChanged={onSelectedKeyChanged}
                        itemTemplate={tumblerItemIconTemplate}
                    />
                </div>
            </div>
        </div>
    );
});

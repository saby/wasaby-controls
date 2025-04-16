import { Button } from 'Controls/buttons';
import { useState, useRef, forwardRef } from 'react';
import { Opener } from 'Controls/popup';
import ComboBox from 'Controls/ComboBox';
import { RecordSet } from 'Types/collection';

export default forwardRef(function Demo(props, ref) {
    const [selectedKey, setSelectedKey] = useState([0]);
    const popupRef = useRef(null);
    const items = new RecordSet({
        keyProperty: 'key',
        rawData: [
            { key: 0, title: 'largeCard' },
            { key: 1, title: 'smallCard' },
            { key: 2, title: 'primitiveCard' },
            { key: 3, title: 'largeDictionary' },
            { key: 4, title: 'smallDictionary' },
            { key: 5, title: 'list' },
            { key: 6, title: 'complexAction' },
            { key: 7, title: 'simpleAction' },
            { key: 8, title: 'confirmation' },
            { key: 9, title: 'info' },
            { key: 10, title: 'notification' },
        ],
    });

    const openPopup = () => {
        const options = {};
        if (selectedKey === 9 || selectedKey === 8) {
            options.contentComponent = null;
            options.message = 'Контент внутри окна';
        }
        popupRef.current.open(options);
    };

    const onSelectedKeyChanged = (selectedKey) => {
        popupRef.current.close();
        setSelectedKey(selectedKey);
    };

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '250px' }}>
                <div ref={ref}>
                    <ComboBox
                        items={items}
                        buildByItems={true}
                        keyProperty="key"
                        displayProperty="title"
                        selectedKey={selectedKey}
                        onSelectedKeyChanged={onSelectedKeyChanged}
                        customEvents={['onSelectedKeysChanged']}
                    />
                    <Opener
                        width={400}
                        popupType={items.at(selectedKey).get('title')}
                        ref={popupRef}
                        contentComponent={'Controls-demo/Popup/Opener/Portal/PopupType/Template'}
                    />
                    <Button
                        className="controls-margin_top-m"
                        caption="Открыть окно"
                        onClick={openPopup}
                    />
                </div>
            </div>
        </div>
    );
});

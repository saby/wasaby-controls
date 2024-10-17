import { Button } from 'Controls/buttons';
import { useState, useRef, forwardRef } from 'react';
import { Opener } from 'Controls/popup';
import { Selector } from 'Controls/dropdown';
import { RecordSet } from 'Types/collection';

export default forwardRef(function Demo(props, ref) {
    const [selectedKeys, setSelectedKeys] = useState([0]);
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
        if (selectedKeys[0] === 9 || selectedKeys[0] === 8) {
            options.contentComponent = null;
            options.message = 'Контент внутри окна';
        }
        popupRef.current.open(options);
    };

    const onSelectedKeyChanged = (selectedKey) => {
        popupRef.current.close();
        setSelectedKeys(selectedKey);
    };

    return (
        <div ref={ref}>
            <Selector
                items={items}
                buildByItems={true}
                keyProperty="key"
                displayProperty="title"
                selectedKeys={selectedKeys}
                onSelectedKeysChanged={onSelectedKeyChanged}
                customEvents={['onSelectedKeysChanged']}
            />
            <Opener
                width={400}
                popupType={items.at(selectedKeys[0]).get('title')}
                ref={popupRef}
                contentComponent={'Controls-demo/Popup/Opener/Portal/PopupType/Template'}
            />
            <Button caption="Открыть окно" onClick={openPopup} />
        </div>
    );
});

import { useContent } from 'UICore/Jsx';
import { useMemo, useState, useCallback, forwardRef } from 'react';
import { Popup as MenuPopup, ItemTemplate } from 'Controls/menu';
import { RecordSet } from 'Types/collection';

const items = new RecordSet({
    keyProperty: 'key',
    rawData: [
        { key: 1, title: 'Add', icon: 'icon-Bell' },
        { key: 2, title: 'Vacation', icon: 'icon-Vacation' },
        { key: 3, title: 'Time off', icon: 'icon-SelfVacation' },
        { key: 4, title: 'Hospital', icon: 'icon-Sick' },
        { key: 5, title: 'Business trip', icon: 'icon-statusDeparted' },
        {
            key: 6,
            title: 'Task',
            icon: 'icon-TFTask',
            additional: true,
        },
        {
            key: 7,
            title: 'Incident',
            icon: 'icon-Alert',
            additional: true,
        },
        {
            key: 8,
            title: 'Outfit',
            icon: 'icon-PermittedBuyers',
            additional: true,
        },
        {
            key: 9,
            title: 'Project',
            icon: 'icon-Document',
            additional: true,
        },
        {
            key: 10,
            title: 'Check',
            icon: 'icon-Statistics',
            additional: true,
        },
        {
            key: 11,
            title: 'Meeting',
            icon: 'icon-Groups',
            additional: true,
        },
        {
            key: 12,
            title: 'Treaties',
            icon: 'icon-Report',
            additional: true,
        },
    ],
});

const Item = forwardRef((props, ref) => {
    const { selectedKey } = props;
    const item = props.item.contents;
    const [title, id] = [item.get('title'), item.get('key')];

    return (
        <ItemTemplate
            {...props}
            ref={ref}
            contentTemplate={
                <div className="tw-flex tw-items-baseline">
                    <div className={id === selectedKey ? 'controls-fontweight-bold' : ''}>
                        {title}
                    </div>
                </div>
            }
        />
    );
});

export default forwardRef(function Demo(_, ref) {
    const [selectedKeys, setSelectedKeys] = useState(() => [1]);
    const onResult = useCallback(
        (eventName: string, item) => {
            if (eventName === 'itemClick') {
                setSelectedKeys([item.getKey()]);
            }
        },
        [setSelectedKeys]
    );

    const itemTemplateOptions = useMemo(() => {
        return {
            selectedKey: selectedKeys[0],
        };
    }, [selectedKeys]);

    return (
        <MenuPopup
            ref={ref}
            className="controls-padding_left-2xs"
            keyProperty="key"
            headingCaption="Кого слушаем?"
            closeButtonVisibility={false}
            items={items}
            selectedKeys={selectedKeys}
            itemTemplate={Item}
            itemTemplateOptions={itemTemplateOptions}
            onSendResult={onResult}
        />
    );
});

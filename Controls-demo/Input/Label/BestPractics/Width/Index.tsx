import { CSSProperties, forwardRef, useState } from 'react';
import { Label, Text } from 'Controls/input';
import { Control } from 'Controls/Tumbler';
import { useDemoData } from '../resources/data';
import { RecordSet } from 'Types/collection';

const items = new RecordSet({
    rawData: [
        {
            id: '200',
            title: '200px',
        },
        {
            id: '300',
            title: '300px',
        },
        {
            id: '500',
            title: '500px',
        },
    ],
    keyProperty: 'id',
});

export default forwardRef(function Width(_, ref) {
    const { address, addressHandler } = useDemoData();
    const [selectedKey, setSelectedKey] = useState('200');
    const style: CSSProperties = {
        border: 1,
        borderColor: '#000',
        borderStyle: 'solid',
        width: +selectedKey,
    };
    return (
        <div
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
            ref={ref}
        >
            <div className="tw-flex">
                <Label caption="Ширина:" />
                <Control
                    items={items}
                    selectedKey={selectedKey}
                    onSelectedKeyChanged={setSelectedKey}
                    customEvents={['onSelectedKeyChanged']}
                />
            </div>
            <div className="tw-flex controls-padding-m controls-margin_top-m" style={style}>
                <div className="controlsDemo__cell tw-w-full ws-flex-column tw-flex">
                    <Label caption="Адрес" />
                    <Text value={address} onValueChanged={addressHandler} />
                </div>
            </div>
        </div>
    );
});

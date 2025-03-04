import { forwardRef, useMemo, useState } from 'react';
import { RecordSet } from 'Types/collection';
import { Control } from 'Controls/Tumbler';
import 'css!Controls-demo/toggle/Tumbler/CustomStyle/Index';

export default forwardRef(function BackgroundStyle(_, ref) {
    const [selectedKeyDefault, setSelectedKeyDefault] = useState('2');
    const onSelectedChanged = (key: string) => {
        setSelectedKeyDefault(key);
    };
    const items = useMemo(() => {
        return new RecordSet({
            rawData: [
                {
                    id: '1',
                    title: 'Item 1',
                },
                {
                    id: '2',
                    title: 'Item 2',
                },
            ],
            keyProperty: 'id',
        });
    }, []);

    return (
        <div ref={ref} className="tw-flex tw-justify-center tw-align-items-center">
            <div className="controlsDemo__flex ws-flex-column">
                <div className="controls-text-label">стандартное отображение</div>
                <Control
                    items={items}
                    selectedKey={selectedKeyDefault}
                    onSelectedKeyChanged={onSelectedChanged}
                    className="controls-margin_bottom-s"
                />
                <div className="controls-text-label">кастомное отображение</div>
                <Control
                    items={items}
                    selectedKey={selectedKeyDefault}
                    onSelectedKeyChanged={onSelectedChanged}
                    className="controls-margin_bottom-s custom_tumbler_style"
                />
            </div>
        </div>
    );
});

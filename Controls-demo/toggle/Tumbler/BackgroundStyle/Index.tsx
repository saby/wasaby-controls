import { forwardRef, useMemo, useState } from 'react';
import { RecordSet } from 'Types/collection';
import { Control } from 'Controls/Tumbler';

export default forwardRef(function BackgroundStyle(_, ref) {
    const [selectedKeyDefault, setSelectedKeyDefault] = useState('2');
    const [selectedKeyContrast, setSelectedKeyContrast] = useState('2');
    const onSelectedChanged = (key: string) => {
        setSelectedKeyDefault(key);
    };
    const onSelectedContrastChanged = (key: string) => {
        setSelectedKeyContrast(key);
    }
    const items = useMemo(() => {
        return new RecordSet({
            rawData: [
                {
                    id: '1',
                    title: 'Item 1',
                    icon: 'icon-EmptyMessage',
                },
                {
                    id: '2',
                    title: 'Item 2',
                    icon: 'icon-Email',
                },
                {
                    id: '3',
                    title: 'Item 3',
                    icon: 'icon-Edit',
                },
            ],
            keyProperty: 'id',
        });
    }, []);

    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center"
        >
            <div
                className="controlsDemo__flex ws-flex-column ws-align-items-center"
                data-qa="controlsDemo_capture"
            >
                <div className="tw-flex tw-items-baseline">
                    <div className='controlsDemo__flex ws-flex-column'>
                        <Control
                            items={items}
                            direction="horizontal"
                            selectedKey={selectedKeyDefault}
                            backgroundStyle='secondary'
                            customEvents={['onSelectedKeyChanged']}
                            onSelectedKeyChanged={onSelectedChanged}
                            className='controls-margin_bottom-s'
                        />
                        <Control
                            items={items}
                            direction="horizontal"
                            selectedKey={selectedKeyDefault}
                            backgroundStyle='primary'
                            customEvents={['onSelectedKeyChanged']}
                            onSelectedKeyChanged={onSelectedChanged}
                            className='controls-margin_bottom-s'
                        />
                        <Control
                            items={items}
                            direction="horizontal"
                            selectedKey={selectedKeyDefault}
                            backgroundStyle='success'
                            customEvents={['onSelectedKeyChanged']}
                            onSelectedKeyChanged={onSelectedChanged}
                            className='controls-margin_bottom-s'
                        />
                        <Control
                            items={items}
                            direction="horizontal"
                            selectedKey={selectedKeyDefault}
                            backgroundStyle='warning'
                            customEvents={['onSelectedKeyChanged']}
                            onSelectedKeyChanged={onSelectedChanged}
                            className='controls-margin_bottom-s'
                        />
                        <Control
                            items={items}
                            direction="horizontal"
                            selectedKey={selectedKeyDefault}
                            backgroundStyle='danger'
                            customEvents={['onSelectedKeyChanged']}
                            onSelectedKeyChanged={onSelectedChanged}
                            className='controls-margin_bottom-s'
                        />
                        <Control
                            items={items}
                            direction="horizontal"
                            selectedKey={selectedKeyDefault}
                            backgroundStyle='info'
                            customEvents={['onSelectedKeyChanged']}
                            onSelectedKeyChanged={onSelectedChanged}
                        />
                    </div>
                    <div className="controls-margin_left-m controlsDemo__flex ws-flex-column controlsDemo__background">
                        <Control
                            items={items}
                            direction="horizontal"
                            contrastBackground={true}
                            selectedKey={selectedKeyContrast}
                            backgroundStyle='secondary'
                            customEvents={['onSelectedKeyChanged']}
                            onSelectedKeyChanged={onSelectedContrastChanged}
                            className='controls-margin_bottom-s'
                        />
                        <Control
                            items={items}
                            direction="horizontal"
                            contrastBackground={true}
                            selectedKey={selectedKeyContrast}
                            backgroundStyle='primary'
                            customEvents={['onSelectedKeyChanged']}
                            onSelectedKeyChanged={onSelectedContrastChanged}
                            className='controls-margin_bottom-s'
                        />
                        <Control
                            items={items}
                            direction="horizontal"
                            contrastBackground={true}
                            selectedKey={selectedKeyContrast}
                            backgroundStyle='success'
                            customEvents={['onSelectedKeyChanged']}
                            onSelectedKeyChanged={onSelectedContrastChanged}
                            className='controls-margin_bottom-s'
                        />
                        <Control
                            items={items}
                            direction="horizontal"
                            contrastBackground={true}
                            selectedKey={selectedKeyContrast}
                            backgroundStyle='warning'
                            customEvents={['onSelectedKeyChanged']}
                            onSelectedKeyChanged={onSelectedContrastChanged}
                            className='controls-margin_bottom-s'
                        />
                        <Control
                            items={items}
                            direction="horizontal"
                            contrastBackground={true}
                            selectedKey={selectedKeyContrast}
                            backgroundStyle='danger'
                            customEvents={['onSelectedKeyChanged']}
                            onSelectedKeyChanged={onSelectedContrastChanged}
                            className='controls-margin_bottom-s'
                        />
                        <Control
                            items={items}
                            direction="horizontal"
                            contrastBackground={true}
                            selectedKey={selectedKeyContrast}
                            backgroundStyle='info'
                            customEvents={['onSelectedKeyChanged']}
                            onSelectedKeyChanged={onSelectedContrastChanged}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

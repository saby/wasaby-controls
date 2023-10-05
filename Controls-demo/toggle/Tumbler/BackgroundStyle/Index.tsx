import { forwardRef, useMemo } from 'react';
import { RecordSet } from 'Types/collection';
import { Control } from 'Controls/Tumbler';

export default forwardRef(function BackgroundStyle(_, ref) {
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
    const backgroundStyles = ['secondary', 'primary', 'success', 'warning', 'danger', 'info'];

    return <div ref={ref} className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center">
        <div
            className="controlsDemo__flex ws-flex-column ws-align-items-center"
            data-qa="controlsDemo_capture">
            {
                backgroundStyles.map((bg) => {
                    return <div className="tw-flex tw-items-baseline" key={bg}>
                        <div>
                            <Control items={items}
                                     direction="horizontal"
                                     contrastBackground={false}
                                     selectedKey="2"
                                     backgroundStyle={bg}
                            />
                        </div>
                        <div className="controls-margin_left-m controlsDemo__background">
                            <Control items={items}
                                     direction="horizontal"
                                     contrastBackground={true}
                                     selectedKey="2"
                                     backgroundStyle={bg}
                            />
                        </div>
                    </div>;
                })
            }
        </div>
    </div>;
});
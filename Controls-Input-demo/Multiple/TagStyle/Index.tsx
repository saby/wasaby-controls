import * as React from 'react';
import Multiple, { IInputSetting } from 'Controls-Input/Multiple';
import { Phone, Text } from 'Controls/input';

export default React.forwardRef(function TagStyle(_: unknown, ref: React.ForwardedRef<unknown>) {
    // @ts-ignore
    const inputSettings: IInputSetting[] = React.useMemo(() => {
        return [
            {
                component: Phone,
                componentProps: {
                    placeholder: '+7 Телефон',
                    onlyMobile: true,
                    'data-qa': 'Controls-Input-demo_Multiple__default-phone',
                },
            },
            {
                component: Text,
                componentProps: {
                    placeholder: 'Примечание',
                    'data-qa': 'Controls-Input-demo_Multiple__default-second-text',
                },
            },
            {
                component: Text,
                componentProps: {
                    placeholder: 'Примечание',
                    'data-qa': 'Controls-Input-demo_Multiple__default-third-text',
                },
            },
        ];
    }, []);

    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
            tabIndex={0}
        >
            <div
                className="tw-flex ws-flex-column ws-align-items-center"
                data-qa="controlsDemo_capture"
            >
                <div className="controlsDemo__cell">
                    <div className="extControlsDemo controls-margin_top-m controlsDemo_fixedWidth300">
                        <Multiple inputSettings={inputSettings} tagStyle="primary" />
                    </div>
                    <div className="extControlsDemo controls-margin_top-m controlsDemo_fixedWidth300">
                        <Multiple inputSettings={inputSettings} tagStyle="secondary" />
                    </div>
                    <div className="extControlsDemo controls-margin_top-m controlsDemo_fixedWidth300">
                        <Multiple inputSettings={inputSettings} tagStyle="success" />
                    </div>
                    <div className="extControlsDemo controls-margin_top-m controlsDemo_fixedWidth300">
                        <Multiple inputSettings={inputSettings} tagStyle="danger" />
                    </div>
                    <div className="extControlsDemo controls-margin_top-m controlsDemo_fixedWidth300">
                        <Multiple inputSettings={inputSettings} tagStyle="warning" />
                    </div>
                    <div className="extControlsDemo controls-margin_top-m controlsDemo_fixedWidth300">
                        <Multiple inputSettings={inputSettings} tagStyle="info" />
                    </div>
                </div>
            </div>
        </div>
    );
});

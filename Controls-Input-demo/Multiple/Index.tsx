import * as React from 'react';
import Multiple, { IInputSetting } from 'Controls-Input/Multiple';
import { Phone, Text } from 'Controls/input';

export default React.forwardRef(function TextDemo(_: unknown, ref: React.ForwardedRef<unknown>) {
    // @ts-ignore
    const inputSettings: IInputSetting[] = React.useMemo(() => {
        return [
            {
                component: Phone,
                componentProps: {
                    placeholder: '+7 Телефон',
                    onlyMobile: true
                }
            },
            {
                component: Text,
                componentProps: {
                    placeholder: 'Примечание'
                }
            }
        ];
    }, []);
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
             tabIndex={0}>
            <div className="controlsDemo__cell">
                <div className="extControlsDemo controls-margin_left-m controlsDemo_fixedWidth300">
                    <Multiple inputSettings={inputSettings}/>
                </div>
            </div>
            <div className="controlsDemo__cell controls-padding-m controls-background-unaccented-same">
                <div className="extControlsDemo controls-margin_left-m controlsDemo_fixedWidth300">
                    <Multiple
                        inputSettings={inputSettings}
                        contrastBackground={true}
                    />
                </div>
            </div>
        </div>
    );
});

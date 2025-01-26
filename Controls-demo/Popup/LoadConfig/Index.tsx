import { useRef, forwardRef } from 'react';
import { Button } from 'Controls/buttons';
import { Opener } from 'Controls/popup';

function LoadConfig(props, ref) {
    const openerRef = useRef();
    const openPopupLoadConfig = () => {
        openerRef.current.open({
            loadConfig: getLoadConfig(),
        });
    };

    const openPopupLoadConfigGetter = () => {
        openerRef.current.open({
            loadConfigGetter,
            templateOptions: {
                key: 1,
            },
        });
    };

    const getLoadConfig = () => {
        return {
            popupConfig: {
                dataFactoryName: 'Controls-demo/Popup/LoadConfig/CustomFactory',
            },
        };
    };

    const loadConfigGetter = (config) => {
        // Пример использования конфига окна для расчета loadConfig
        if (config.templateOptions.key === 1) {
            return Promise.resolve(getLoadConfig());
        }
    };

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col tw-items-center">
                <Button
                    onClick={openPopupLoadConfig}
                    caption="Открыть окно с предзагруженными данными через loadConfig"
                />
                <Button
                    className={'controls-margin_top-m'}
                    onClick={openPopupLoadConfigGetter}
                    caption="Открыть окно с предзагруженными данными через loadConfigGetter"
                />
                <Opener
                    ref={openerRef}
                    contentComponent={'Controls-demo/Popup/LoadConfig/Popup'}
                    popupType={'smallCard'}
                />
            </div>
        </div>
    );
}

export default forwardRef(LoadConfig);

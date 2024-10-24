import { useRef, forwardRef } from 'react';
import { Button } from 'Controls/buttons';
import { Opener } from 'Controls/popup';

function LoadConfig(props, ref) {
    const openerRef = useRef();
    const openPopup = () => {
        openerRef.current.open({
            loadConfig: getLoadConfig(),
        });
    };

    const getLoadConfig = () => {
        return {
            popupConfig: {
                dataFactoryName: 'Controls-demo/Popup/LoadConfig/CustomFactory',
            },
        };
    };

    return (
        <div ref={ref}>
            <Button onClick={openPopup} caption="Открыть окно с предзагруженными данными" />
            <Opener
                ref={openerRef}
                contentComponent={'Controls-demo/Popup/LoadConfig/Popup'}
                popupType={'smallCard'}
            />
        </div>
    );
}

export default forwardRef(LoadConfig);

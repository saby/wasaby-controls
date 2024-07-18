import { Button } from 'Controls/buttons';
import { useState, useRef } from 'react';
import { Opener } from 'Controls/popup';

export default function Demo() {
    const [templateOptions, setTemplateOptions] = useState({ counter: 0 });
    const popupRef = useRef(null);

    const openPortal = () => {
        popupRef.current.open({});
    };

    const updateCounter = () => {
        setTemplateOptions({
            counter: templateOptions.counter + 1,
        });
    };

    return (
        <div>
            <Opener
                width={400}
                ref={popupRef}
                template={'Controls-demo/Popup/Opener/IsPortal/Template'}
                templateOptions={templateOptions}
            />
            <Button caption="Открыть портал" onClick={openPortal} />
            <Button caption="Обновить контент в портале" onClick={updateCounter} />
        </div>
    );
}

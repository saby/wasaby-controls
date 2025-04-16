import { useCallback, forwardRef, useState } from 'react';
import { Button } from 'Controls/buttons';
import { Dialog } from 'Controls/popupTemplate';
import 'css!Controls-demo/Popup/Dialog/doc/Template/Template';

function Template(props) {
    const [sizes, setSizes] = useState({ height: 200, width: 400 });
    const getBodyContentTemplate = useCallback(() => {
        const updateSizes = () => {
            if (sizes.height === 200) {
                setSizes({ height: 300, width: 500 });
            } else {
                setSizes({ height: 200, width: 400 });
            }
        };
        return (
            <div className="controlsDemo-Dialog__template">
                <Button caption="Увеличить" onClick={updateSizes} />
            </div>
        );
    }, [sizes]);
    return (
        <Dialog
            {...props}
            style={{
                height: `${sizes.height}px`,
                width: `${sizes.width}px`,
            }}
            bodyContentTemplate={getBodyContentTemplate}
            headingCaption={'Контент внутри шапки окна'}
        />
    );
}

export default forwardRef(Template);

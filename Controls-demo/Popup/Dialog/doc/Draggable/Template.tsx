import { useCallback, forwardRef } from 'react';
import { Dialog } from 'Controls/popupTemplate';
import { EventSubscriber } from 'UI/Events';
import 'css!Controls-demo/Popup/Dialog/doc/Template/Template';

function Template(props) {
    const getBodyContentTemplate = useCallback(() => {
        return <div className="controlsDemo-Dialog__template">Контент внутри диалогового окна</div>;
    }, []);
    return (
        <EventSubscriber
            onPopupDragStart={props.onPopupDragStart}
            onPopupDragEnd={props.onPopupDragEnd}
            onPopupMovingSize={props.handleChangeSize}
        >
            <Dialog
                {...props}
                draggable={true}
                bodyContentTemplate={getBodyContentTemplate}
                headingCaption={'Контент внутри шапки окна'}
            />
        </EventSubscriber>
    );
}

export default forwardRef(Template);

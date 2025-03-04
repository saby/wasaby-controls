import { useCallback, forwardRef } from 'react';
import { Sticky } from 'Controls/popupTemplate';
import 'css!Controls-demo/Popup/Sticky/doc/Template/Template';

function Template(props) {
    const getBodyContentTemplate = useCallback(() => {
        return (
            <div className="controlsDemo-Sticky__template">Контент внутри прилипающего окна</div>
        );
    }, []);
    return (
        <Sticky
            {...props}
            bodyContentTemplate={props.bodyContentTemplate || getBodyContentTemplate}
            headingCaption={props.headingCaption || 'Контент внутри шапки окна'}
        />
    );
}

export default forwardRef(Template);

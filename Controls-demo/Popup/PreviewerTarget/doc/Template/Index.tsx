import { useCallback, forwardRef } from 'react';
import { Dialog } from 'Controls/popupTemplate';
import 'css!Controls-demo/Popup/PreviewerTarget/doc/Template/Template';

function Template(props) {
    const getBodyContentTemplate = useCallback(() => {
        return <div className="controlsDemo-Previewer__template">Контент внутри мини-карточки</div>;
    }, []);
    return (
        <Dialog
            {...props}
            bodyContentTemplate={getBodyContentTemplate}
            headingCaption={'Контент внутри шапки окна'}
        />
    );
}

export default forwardRef(Template);

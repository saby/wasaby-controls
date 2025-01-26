import { useCallback, forwardRef } from 'react';
import { Stack } from 'Controls/popupTemplate';
import { showType, View as Toolbar } from 'Controls/toolbars';
import 'css!Controls-demo/Popup/Stack/doc/Template/Template';
import { RecordSet } from 'Types/collection';

const toolbarItems: RecordSet = new RecordSet({
    rawData: [
        {
            id: '1',
            showType: showType.TOOLBAR,
            icon: 'icon-Time',
        },
        {
            id: '2',
            showType: showType.TOOLBAR,
            icon: 'icon-Check',
        },
        {
            id: '3',
            showType: showType.TOOLBAR,
            icon: 'icon-Copy',
        },
    ],
    keyProperty: 'id',
});

function Template(props) {
    const getBodyContentTemplate = useCallback(() => {
        return <div className="controlsDemo-Stack__template">Контент внутри стекового окна</div>;
    }, []);

    const getHeaderContentTemplate = useCallback(() => {
        return <div className="controlsDemo-Stack__template">Контент внутри шапки окна</div>;
    }, []);

    const getToolbarContentTemplate = useCallback(() => {
        return <Toolbar items={toolbarItems} keyProperty="id" direction="vertical" />;
    }, []);
    return (
        <Stack
            {...props}
            toolbarContentTemplate={getToolbarContentTemplate()}
            bodyContentTemplate={getBodyContentTemplate()}
            headerContentTemplate={getHeaderContentTemplate()}
        />
    );
}

export default forwardRef(Template);

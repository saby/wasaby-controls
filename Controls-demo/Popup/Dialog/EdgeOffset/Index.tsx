import { DialogOpener } from 'Controls/popup';
import { forwardRef, useRef } from 'react';
import { Dialog as DialogTemplate } from 'Controls/popupTemplate';
import { Button } from 'Controls/buttons';
import { Label } from 'Controls/input';
import 'css!DemoStand/Controls-demo';

function CustomDialogTemplate(props) {
    const getBodyContentTemplate = () => {
        return <div className="controlsDemo__ml1">Контент окна</div>;
    };
    return (
        <DialogTemplate
            {...props}
            headingCaption="Заголовок окна"
            draggable={true}
            bodyContentTemplate={getBodyContentTemplate()}
        />
    );
}

export default forwardRef(function EdgeOffsetDemo(props, ref) {
    const openerRef = useRef(null);
    const onClickHandler = () => {
        if (!openerRef.current) {
            openerRef.current = new DialogOpener();
        }
        openerRef.current.open({
            template: CustomDialogTemplate,
            width: 400,
            height: 200,
            edgeOffset: {
                top: 100,
                left: 100,
                bottom: 200,
                right: 200,
            },
        });
    };
    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '500px' }}>
                <Label caption="Отступ сверху и слева 100px, отступ снизу и справа 200px" />
                <Button caption={'Открыть окно'} onClick={onClickHandler} />
            </div>
        </div>
    );
});

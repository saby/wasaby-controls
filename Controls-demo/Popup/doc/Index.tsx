import { StackOpener, DialogOpener, NotificationOpener } from 'Controls/popup';
import { forwardRef, useRef, useCallback, RefObject } from 'react';
import { Button } from 'Controls/buttons';

function Index(props, ref) {
    const stackOpenerRef: RefObject<StackOpener> = useRef();
    const dialogOpenerRef: RefObject<StackOpener> = useRef();

    const openStack = useCallback(() => {
        if (!stackOpenerRef.current) {
            stackOpenerRef.current = new StackOpener();
        }
        stackOpenerRef.current.open({
            template: 'Controls-demo/Popup/Stack/doc/Template/Index',
            width: 1200,
        });
    }, []);

    const openDialog = useCallback(() => {
        if (!dialogOpenerRef.current) {
            dialogOpenerRef.current = new DialogOpener();
        }
        dialogOpenerRef.current.open({
            template: 'Controls-demo/Popup/Dialog/doc/Template/Index',
            width: 400,
            height: 200,
        });
    }, []);

    const openNotification = useCallback(() => {
        new NotificationOpener().open({
            template: 'Controls/popupTemplate:NotificationSimple',
            templateOptions: {
                backgroundStyle: 'success',
                text: 'Текст нотификационного окна',
                icon: 'icon-Successful',
            },
        });
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '250px' }}>
                <Button caption="Открыть стековое окно" onClick={openStack} />
                <Button
                    caption="Открыть диалоговое окно"
                    onClick={openDialog}
                    className="controls-margin_top-m"
                />
                <Button
                    caption="Открыть нотификационное окно"
                    onClick={openNotification}
                    className="controls-margin_top-m"
                />
            </div>
        </div>
    );
}

export default forwardRef(Index);

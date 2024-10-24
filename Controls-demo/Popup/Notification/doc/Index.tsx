import { useCallback } from 'react';
import { NotificationOpener } from 'Controls/popup';
import { Button } from 'Controls/buttons';
import { Label } from 'Controls/input';

export default function ConfirmationDemo() {
    const openSuccessNotification = useCallback(() => {
        new NotificationOpener().open({
            template: 'Controls/popupTemplate:NotificationSimple',
            templateOptions: {
                backgroundStyle: 'success',
                text: 'Текст нотификационного окна',
                icon: 'icon-Successful',
            },
        });
    }, []);

    const openDangerNotification = useCallback(() => {
        new NotificationOpener().open({
            template: 'Controls/popupTemplate:NotificationSimple',
            templateOptions: {
                backgroundStyle: 'danger',
                text: 'Текст нотификационного окна',
                icon: 'icon-Alert',
            },
        });
    }, []);

    return (
        <div className="tw-flex tw-justify-center">
            <div className="tw-flex tw-flex-col" style={{ width: '400px' }}>
                <Label caption='backgroundStyle="success" icon="icon-Successful"' />
                <Button caption="Открыть нотификационное окно" onClick={openSuccessNotification} />
                <Label caption='backgroundStyle="danger" icon="icon-Alert"' />
                <Button caption="Открыть нотификационное окно" onClick={openDangerNotification} />
            </div>
        </div>
    );
}

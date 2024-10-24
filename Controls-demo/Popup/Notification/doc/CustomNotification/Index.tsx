import { useCallback } from 'react';
import { NotificationOpener } from 'Controls/popup';
import { Notification } from 'Controls/popupTemplate';
import { Button } from 'Controls/buttons';
import { Label } from 'Controls/input';

function CustomTemplate() {
    const getBodyContentTemplate = useCallback(() => {
        return (
            <div>
                Пользовательский контент с кнопкой <Button caption={'Клик'} />
            </div>
        );
    }, []);
    return (
        <Notification
            backgroundStyle="success"
            icon="icon-Successful"
            bodyContentTemplate={getBodyContentTemplate}
        />
    );
}

export default function ConfirmationDemo() {
    const openNotification = useCallback(() => {
        new NotificationOpener().open({
            template: CustomTemplate,
        });
    }, []);

    return (
        <div className="tw-flex tw-justify-center">
            <div className="tw-flex tw-flex-col" style={{ width: '400px' }}>
                <Label caption="Открытие нотификационного окна с кастомным контентом" />
                <Button caption="Открыть нотификационное окно" onClick={openNotification} />
            </div>
        </div>
    );
}

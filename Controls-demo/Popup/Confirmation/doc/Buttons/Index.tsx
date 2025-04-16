import { DialogTemplate } from 'Controls/popupConfirmation';

export default function ConfirmationDemo() {
    const buttons = [
        {
            caption: 'Да',
            buttonStyle: 'primary',
            value: true,
        },
        {
            caption: 'Нет, не спрашивать больше',
            fontColorStyle: 'unaccented',
            viewMode: 'link',
            value: false,
        },
    ];
    return (
        <div className="tw-flex tw-justify-center">
            <div
                className="tw-flex tw-justify-between controls-margin_top-m"
                style={{ width: '400px' }}
            >
                <DialogTemplate buttons={buttons} message="Сохранить изменения?" />
            </div>
        </div>
    );
}

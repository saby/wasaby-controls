import { DialogTemplate } from 'Controls/popupConfirmation';

export default function ConfirmationDemo() {
    return (
        <div className="tw-flex tw-justify-center">
            <div
                className="tw-flex tw-justify-between controls-margin_top-m"
                style={{ width: '730px' }}
            >
                <DialogTemplate
                    type="yesnocancel"
                    message="Сохранить изменения?"
                    details="Чтобы продолжить редактирование, нажмите «Отмена»"
                />
                <DialogTemplate
                    type="ok"
                    markerStyle="success"
                    message="Задача перенесена в другой раздел"
                />
            </div>
        </div>
    );
}

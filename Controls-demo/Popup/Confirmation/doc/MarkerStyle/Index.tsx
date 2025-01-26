import { DialogTemplate } from 'Controls/popupConfirmation';

export default function ConfirmationDemo() {
    return (
        <div className="tw-flex tw-justify-center">
            <div className="tw-flex tw-flex-col" style={{ width: '400px' }}>
                <DialogTemplate
                    markerStyle="success"
                    message="Окно успеха"
                    type="ok"
                    className="controls-margin_top-m"
                />
                <DialogTemplate
                    markerStyle="danger"
                    message="Окно ошибки"
                    type="ok"
                    className="controls-margin_top-m"
                />
                <DialogTemplate
                    markerStyle="warning"
                    message="Окно предупреждения"
                    type="ok"
                    className="controls-margin_top-m"
                />
            </div>
        </div>
    );
}

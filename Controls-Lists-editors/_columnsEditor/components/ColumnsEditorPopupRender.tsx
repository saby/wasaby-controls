import { TransparentDataContextProvider } from 'Frame/player';
import { Dialog } from 'Controls/popupTemplate';
import { BodyContentTemplate } from './BodyContentTemplate';
import { IColumnsEditorRenderProps } from '../interface';
import { Button } from 'Controls/buttons';

/**
 * Компонент - шаблон окна диалога редактора колонок
 * @param props {IColumnsEditorRenderProps}
 */
function ColumnsEditorPopupRender(props: IColumnsEditorRenderProps) {
    return (
        <TransparentDataContextProvider
            contextConfig={props.contextConfig}
            contextData={props.contextData}
        >
            <Dialog
                headingCaption={'Настройка колонок'}
                closeButtonViewMode={'functionalButton'}
                bodyContentTemplate={BodyContentTemplate}
                backgroundStyle={'unaccented'}
                headerContentTemplate={
                    <div className="ws-flexbox ws-flex-end">
                        <Button
                            viewMode="filled"
                            buttonStyle="success"
                            iconSize="m"
                            icon="icon-Yes"
                            iconStyle="contrast"
                            tooltip={'Применить'}
                            onClick={() => {
                                props.onClose();
                            }}
                        />
                    </div>
                }
                onClose={() => {
                    props.onClose();
                }}
            />
        </TransparentDataContextProvider>
    );
}

ColumnsEditorPopupRender.isReact = true;
export default ColumnsEditorPopupRender;

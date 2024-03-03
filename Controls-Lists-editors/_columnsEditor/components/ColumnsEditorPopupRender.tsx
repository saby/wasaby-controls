import { TransparentDataContextProvider } from 'Frame/player';
import { Dialog } from 'Controls/popupTemplate';
import { BodyContentTemplate } from './BodyContentTemplate';
import { IColumnsEditorRenderProps } from '../interface';
import { HeaderContentTemplate } from './HeaderContentTemplate';
import * as React from 'react';

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
            <div className={'columnValueListRestrictiveContainer'}>
                <Dialog
                    headingCaption={'Настройка колонок'}
                    closeButtonViewMode={'functionalButton'}
                    bodyContentTemplate={BodyContentTemplate}
                    backgroundStyle={'unaccented'}
                    headerContentTemplate={React.createElement(HeaderContentTemplate, {
                        onClose: props.onClose,
                    })}
                    onClose={() => {
                        props.onClose();
                    }}
                />
            </div>
        </TransparentDataContextProvider>
    );
}

ColumnsEditorPopupRender.isReact = true;
export default ColumnsEditorPopupRender;

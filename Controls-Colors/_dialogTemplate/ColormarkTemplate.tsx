import { useCallback, useMemo, useState } from 'react';
import {Dialog as DialogTemplate, IDialogTemplateOptions} from 'Controls/popupTemplate';
import { Panel, IMarkSelectorPanelOptions } from 'Controls-Colors/colormark';
import {Button, CloseButton} from 'Controls/buttons';
import {isElementContainsFieldOnArr} from '../utils/function';
import 'css!Controls-Colors/dialogTemplate';

function BodyContentTemplate(props: IDialogTemplateOptions & IMarkSelectorPanelOptions) {
    const [keys, setKeys] = useState<string[]>(props.selectedKeys);
    const isMultiSelectMode = useMemo(() => isElementContainsFieldOnArr('icon', props.items), [props.items]);
    const applyButtonClickHandler = useCallback(() => props.onSendresult(null, keys), [keys]);
    const onSelectedKeysChangeHandler = useCallback((newKeys) => {
        setKeys([...newKeys]);
        if (!isMultiSelectMode) {
            props.onSendresult(null, [...newKeys]);
        }
    }, [isMultiSelectMode]);
    return (
        <>
            {
                (isMultiSelectMode && !!props.selectedKeys.length) && (
                    <Button viewMode="filled"
                            icon="icon-Yes"
                            iconStyle="contrast"
                            buttonStyle="success"
                            iconSize="s"
                            className="Controls-Colors__DialogOpener_applyButton"
                            onClick={applyButtonClickHandler}
                    />
                )
            }
            <CloseButton viewMode={isMultiSelectMode && !!props.selectedKeys.length ? 'externalWide' : 'external'}
                         className="Controls-Colors__DialogOpener_closeButton"
                         onClick={props.onClose}
            />
            <Panel items={props.items}
                   adding={props.adding}
                   palette={props.palette}
                   selectedKeys={keys}
                   excludedKeys={props.excludedKeys}
                   className={'controls-padding_bottom-xl ' + props.className}
                   onBeforeSelectionChanged={props.onBeforeSelectionChanged}
                   onBeforeEdit={props.onBeforeEdit}
                   onBeforeDelete={props.onBeforeDelete}
                   onSelectedKeysChanged={onSelectedKeysChangeHandler}
            />
        </>
    );
}
/**
 * Раскладка окна Пометки цветом.
 * @class Controls-Colors/_dialogTemplate/ColormarkTemplate
 * @public
 */
export function PopupTemplate(props: IDialogTemplateOptions & IMarkSelectorPanelOptions) {
    return (
        <DialogTemplate {...props}
                        closeButtonVisible={false}
                        bodyContentTemplate={<BodyContentTemplate {...props}/>}
        />
    );
}

PopupTemplate.isReact = true;

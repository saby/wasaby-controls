import {useCallback, useMemo, useState} from 'react';
import {Dialog as DialogTemplate, IDialogTemplateOptions} from 'Controls/popupTemplate';
import {IMarkSelectorPanelOptions, Panel} from 'Controls-Colors/colormark';
import {Button, CloseButton} from 'Controls/buttons';
import {isElementContainsFieldOnArr} from '../utils/function';
import 'css!Controls-Colors/dialogTemplate';

export interface IColorMarkTemplateProps extends IDialogTemplateOptions, IMarkSelectorPanelOptions {
    onSendResult: (event: Event, keys: string[]) => void;
}

function BodyContentTemplate(props: IColorMarkTemplateProps) {
    const [keys, setKeys] = useState<string[]>(props.selectedKeys);
    const isMultiSelectMode = useMemo(() => isElementContainsFieldOnArr('icon', props.items), [props.items]);
    const applyButtonClickHandler = useCallback(() => {
        if (props.onSendResult) {
            props.onSendResult(null, keys);
        }
    }, [keys]);
    const onSelectedKeysChangeHandler = useCallback((newKeys) => {
        setKeys([...newKeys]);
        if (!isMultiSelectMode && props.onSendResult) {
            props.onSendResult(null, [...newKeys]);
        }
    }, [isMultiSelectMode]);
    return (
        <>
            {
                isMultiSelectMode && (
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
            <CloseButton viewMode={isMultiSelectMode ? 'externalWide' : 'external'}
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
                   onBeforeEndEdit={props.onBeforeEndEdit}
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
export function ColormarkTemplate(props: IColorMarkTemplateProps) {
    return useMemo(() => {
        return (
            <DialogTemplate {...props}
                            closeButtonVisible={false}
                            bodyContentTemplate={<BodyContentTemplate {...props}/>}
                            className={props.className}
            />
        );
    }, [props]);
}

ColormarkTemplate.isReact = true;

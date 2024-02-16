import { useCallback, useMemo, useState } from 'react';
import { Dialog as DialogTemplate, IDialogTemplateOptions } from 'Controls/popupTemplate';
import { IMarkSelectorPanelOptions, Panel } from 'Controls-Colors/colormark';
import { Button } from 'Controls/buttons';
import { CloseButton } from 'Controls/extButtons';
import { isElementContainsFieldOnArr } from '../utils/function';
import 'css!Controls-Colors/dialogTemplate';

export interface IColorMarkTemplateProps extends IDialogTemplateOptions, IMarkSelectorPanelOptions {
    onSendResult: (keys: string[], excludedKeys: string[]) => void;
}

function BodyContentTemplate(props: IColorMarkTemplateProps) {
    const [keys, setKeys] = useState<string[]>(props.selectedKeys);
    const [excludedKeys, setExcludedKeys] = useState<string[]>(props.excludedKeys);
    const [isKeysChanged, setIsKeysChanged] = useState<boolean>(false);

    const isMultiSelectMode = useMemo(
        () => props.multiSelect || isElementContainsFieldOnArr('icon', props.items),
        [props.items, props.multiSelect]
    );

    const applyResult = useCallback(
        (keys, excludedKeys) => {
            if (props.onSendResult) {
                props.onSendResult(keys, excludedKeys);
                if (props.onClose) {
                    props.onClose();
                }
            }
        },
        [props.onSendResult]
    );

    const applyButtonClickHandler = useCallback(() => {
        applyResult(keys, excludedKeys);
    }, [keys, excludedKeys]);

    const onSelectedKeysChangeHandler = useCallback(
        (newKeys, isItemClick) => {
            if (!isKeysChanged) {
                setIsKeysChanged(true);
            }
            setKeys([...newKeys]);
            if (!isMultiSelectMode || isItemClick) {
                applyResult(newKeys, excludedKeys);
            }
        },
        [isMultiSelectMode, excludedKeys]
    );

    const onExcludedKeysChangeHandler = useCallback((newKeys) => {
        if (!isKeysChanged) {
            setIsKeysChanged(true);
        }
        setExcludedKeys([...newKeys]);
    }, []);

    return (
        <>
            {isMultiSelectMode && isKeysChanged && (
                <Button
                    viewMode="filled"
                    icon="icon-Yes"
                    iconStyle="contrast"
                    buttonStyle="success"
                    iconSize={props.isAdaptive ? 'l' : 's'}
                    inlineHeight={props.isAdaptive ? '7xl' : 'l'}
                    className={
                        'Controls-Colors__DialogOpener_applyButton' +
                        ' Controls-Colors__DialogOpener_applyButton_position' +
                        (props.isAdaptive ? '_adaptive' : '_default')
                    }
                    readOnly={props.isEditing}
                    onClick={applyButtonClickHandler}
                />
            )}
            {!props.isAdaptive && (
                <CloseButton
                    viewMode={isMultiSelectMode && isKeysChanged ? 'externalWide' : 'external'}
                    className="Controls-Colors__DialogOpener_closeButton"
                    onClick={props.onClose}
                />
            )}
            <Panel
                items={props.items}
                adding={props.adding}
                palette={props.palette}
                selectedKeys={keys}
                excludedKeys={excludedKeys}
                excludable={props.excludable}
                multiSelect={props.multiSelect}
                addedItemType={props.addedItemType}
                className={props.className}
                isAdaptive={props.isAdaptive}
                onAfterEndEdit={props.onAfterEndEdit}
                onBeforeBeginEdit={props.onBeforeBeginEdit}
                onBeforeSelectionChanged={props.onBeforeSelectionChanged}
                onBeforeEdit={props.onBeforeEdit}
                onBeforeEndEdit={props.onBeforeEndEdit}
                onBeforeDelete={props.onBeforeDelete}
                onSelectedKeysChanged={onSelectedKeysChangeHandler}
                onExcludedKeysChanged={onExcludedKeysChangeHandler}
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
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const onAfterEndEditHandler = useCallback(() => {
        setIsEditing(false);
        if (props.onAfterEndEdit) {
            props.onAfterEndEdit();
        }
    }, [props.onAfterEndEdit]);

    const onBeforeBeginEditHandler = useCallback(() => {
        setIsEditing(true);
        if (props.onBeforeBeginEdit) {
            props.onBeforeBeginEdit();
        }
    }, [props.onBeforeBeginEdit]);

    return useMemo(() => {
        return (
            <DialogTemplate
                {...props}
                closeButtonVisible={false}
                bodyContentTemplate={
                    <BodyContentTemplate
                        {...props}
                        isEditing={isEditing}
                        onAfterEndEdit={onAfterEndEditHandler}
                        onBeforeBeginEdit={onBeforeBeginEditHandler}
                    />
                }
                headerBackgroundStyle={isEditing ? 'unaccented' : 'default'}
                className={props.className}
            />
        );
    }, [props, isEditing]);
}

ColormarkTemplate.isReact = true;

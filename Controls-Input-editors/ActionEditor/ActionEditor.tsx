import { Fragment, memo, useCallback, useMemo, useRef, RefObject, forwardRef } from 'react';
import { CloseButton } from 'Controls/extButtons';
import { StackOpener } from 'Controls/popup';
import { Button } from 'Controls/buttons';
import { Title } from 'Controls/heading';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { default as actions, IActionConfig } from 'Controls-Actions/actions';
import { IActionOptions } from 'Controls-Input/interface';
import { PropertyGrid } from 'Controls/propertyGrid';
import { Model } from 'Types/entity';
import * as translate from 'i18n!Controls-Actions';

interface IActionEditorProps extends IPropertyGridPropertyEditorProps<IActionOptions> {
    action: any;
    value: IActionOptions;
}

const CUSTOM_EVENTS = ['onEditingObjectChanged'];
const CAPTION_COLUMN_OPTIONS = {
    width: 'auto',
};
const ITEMS_CONTAINER_PADDING = {
    top: 'none',
    bottom: 'xs',
    left: 'none',
    right: 'none',
};

export const openEditActionsPopup = (
    props: IActionEditorProps,
    ref: RefObject<HTMLElement>,
    applyActionConfigByActionType: Function,
    stackOpener: StackOpener
): void => {
    if (!stackOpener.isOpened()) {
        const resolvedActions: IActionConfig[] = [...actions];
        stackOpener.open({
            template: 'Controls-Input-editors/ActionEditor/ActionEditorPopup:ActionEditorPopup',
            templateOptions: { ...props, actions: resolvedActions },
            width: 400,
            opener: ref.current,
            eventHandlers: {
                onResult: (item: Model) => {
                    return applyActionConfigByActionType(item);
                },
            },
        });
    }
};

export const ActionEditorPopupTemplate = forwardRef(function (props, ref): JSX.Element {
    const editingObjectChangedHandler = useCallback(
        (editingObject) => {
            props.editingObjectChangedHandler(editingObject);
        },
        [props.editingObjectChangedHandler]
    );

    return (
        <div
            className={`controls-buttons_actionEditor_wrapper controls-buttons_actionEditor${
                props.className ? ` ${props.className}` : ''
            }`}
            ref={ref}
        >
            <PropertyGrid
                editingObject={props.editingObject}
                typeDescription={props.typeDescription}
                onEditingObjectChanged={editingObjectChangedHandler}
                customEvents={CUSTOM_EVENTS}
                captionColumnOptions={CAPTION_COLUMN_OPTIONS}
                itemsContainerPadding={ITEMS_CONTAINER_PADDING}
            />
        </div>
    );
});

export const ActionEditor = memo((props: IActionEditorProps) => {
    const { value, onChange, LayoutComponent = Fragment } = props;
    const ref = useRef();
    const stackOpener = useMemo(() => {
        return new StackOpener();
    }, []);
    const actionConfig = useMemo<IActionConfig | undefined>(() => {
        if (value) {
            return actions.find((action) => {
                return action.type === value.id;
            });
        }
        return undefined;
    }, [value]);
    const applyActionConfigByActionType = useCallback(
        (actionType: string) => {
            onChange({
                id: actionType,
            });
        },
        [onChange]
    );
    const clearActionConfig = useCallback(() => {
        onChange(null);
    }, []);

    const actionChangedHandler = useCallback((item: Model) => {
        applyActionConfigByActionType(item.get('type'));
    }, []);
    const onClickHandler = useCallback((_) => {
        openEditActionsPopup(props, ref, actionChangedHandler, stackOpener);
    }, []);

    const { typeDescription, editingObject } = useMemo(() => {
        const propTypes = [...(actionConfig?.propTypes || [])];
        propTypes.push({
            type: 'object',
            name: 'hotKey',
            editorTemplateName: 'Controls-Input-editors/ActionEditor/HotKeyEditor',
            caption: translate('Горячая клавиша'),
            validators: ['Controls-Input-editors/ActionEditor/validateHotKey'],
            editorOptions: {
                commandName: actionConfig?.info?.title,
            },
        });
        propTypes.unshift({
            type: 'string',
            name: 'actionButton',
            editorTemplateName: 'Controls-Input-editors/ActionEditor/ActionButtonEditor',
            caption: translate('Действие'),
            editorOptions: {
                buttonCaption: actionConfig?.info?.title,
                buttonClickHandler: onClickHandler,
                closeClickHandler: clearActionConfig,
                closeButtonVisible: true,
            },
        });
        const actionProps = value?.actionProps || actionConfig?.commandOptions || {};
        actionProps.hotKey = value?.hotKey;
        return {
            typeDescription: propTypes,
            editingObject: actionProps,
        };
    }, [actionConfig, value]);

    const editingObjectChangedHandler = useCallback(
        (editingObject: object | Model) => {
            const tmpActionConfig = { ...value };
            tmpActionConfig.actionProps = editingObject;
            tmpActionConfig.hotKey = editingObject?.hotKey;
            delete tmpActionConfig.actionProps?.hotKey;
            onChange(tmpActionConfig);
        },
        [value]
    );

    return (
        <LayoutComponent titlePosition={actionConfig ? 'none' : undefined}>
            {actionConfig ? (
                <ActionEditorPopupTemplate
                    ref={ref}
                    backgroundStyle="unaccented"
                    typeDescription={typeDescription}
                    editingObject={editingObject}
                    actionConfig={actionConfig}
                    editingObjectChangedHandler={editingObjectChangedHandler}
                />
            ) : (
                <Button
                    ref={ref}
                    className="controls-buttons_actionEditor-content"
                    caption={translate('Выбрать')}
                    viewMode="link"
                    onClick={onClickHandler}
                />
            )}
        </LayoutComponent>
    );
});

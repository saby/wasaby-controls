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
    width: '50%',
};
const ITEMS_CONTAINER_PADDING = {
    top: 'xs',
    bottom: 'xs',
    left: 'm',
    right: 'm',
};

const openEditActionsPopup = (
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

export const ActionEditorPopupTemplate = forwardRef(function (props, _forwardedRef): JSX.Element {
    const ref = useRef();
    const stackOpener = useMemo(() => {
        return new StackOpener();
    }, []);
    const editingObjectChangedHandler = useCallback(
        (editingObject) => {
            props.editingObjectChangedHandler(editingObject);
        },
        [props.editingObjectChangedHandler]
    );

    const onClickHandler = useCallback((_) => {
        openEditActionsPopup(props, ref, props.actionChangedHandler, stackOpener);
    }, []);

    const clearActionConfig = useCallback(
        (editingObject) => {
            props.clearActionConfig(editingObject);
        },
        [props.clearActionConfig]
    );
    return (
        <div
            className="controls-buttons_actionEditor_wrapper controls-buttons_actionEditor"
            ref={ref}
        >
            <div className="controls-buttons_actionEditor-content controls__block-wrapper ws-inline-flexbox tw-w-full">
                <div
                    className={
                        'controls__block controls-buttons_actionEditor-block controls-buttons_actionEditor-block-' +
                        props.backgroundStyle
                    }
                >
                    <div className="ws-flexbox ws-align-items-baseline">
                        <Title
                            className="controls-margin_top-s controls-margin_left-m"
                            dataQa="controls-Header_button__link"
                            caption={props.actionConfig?.info?.title}
                            fontColorStyle="link"
                            fontSize="m"
                            fontWeight="normal"
                            onClick={onClickHandler}
                        />
                        {props.closeButtonVisibility !== 'hidden' && (
                            <CloseButton
                                className="controls-margin_left-m"
                                viewMode="link"
                                onClick={clearActionConfig}
                            />
                        )}
                    </div>
                    <PropertyGrid
                        editingObject={props.editingObject}
                        typeDescription={props.typeDescription}
                        onEditingObjectChanged={editingObjectChangedHandler}
                        customEvents={CUSTOM_EVENTS}
                        captionColumnOptions={CAPTION_COLUMN_OPTIONS}
                        itemsContainerPadding={ITEMS_CONTAINER_PADDING}
                    />
                </div>
            </div>
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

    const { typeDescription, editingObject } = useMemo(() => {
        return {
            typeDescription: actionConfig?.propTypes || [],
            editingObject: value?.actionProps || actionConfig?.commandOptions || {},
        };
    }, [actionConfig, value]);

    const applyActionConfigByActionType = useCallback(
        (actionType: string) => {
            onChange({
                id: actionType,
            });
        },
        [onChange]
    );

    const onClickHandler = useCallback((_) => {
        openEditActionsPopup(props, ref, actionChangedHandler, stackOpener);
    }, []);

    const editingObjectChangedHandler = useCallback(
        (editingObject: object | Model) => {
            const tmpActionConfig = { ...value };
            tmpActionConfig.actionProps = editingObject;
            onChange(tmpActionConfig);
        },
        [value]
    );
    const clearActionConfig = useCallback(() => {
        onChange(null);
    }, []);

    const actionChangedHandler = useCallback((item: Model) => {
        applyActionConfigByActionType(item.get('type'));
    }, []);

    return (
        <LayoutComponent
            titlePosition={actionConfig && actionConfig.propTypes ? 'none' : undefined}
        >
            {actionConfig && actionConfig.propTypes ? (
                <ActionEditorPopupTemplate
                    ref={ref}
                    backgroundStyle="unaccented"
                    typeDescription={typeDescription}
                    editingObject={editingObject}
                    actionConfig={actionConfig}
                    editingObjectChangedHandler={editingObjectChangedHandler}
                    clearActionConfig={clearActionConfig}
                    actionChangedHandler={actionChangedHandler}
                />
            ) : (
                <Button
                    ref={ref}
                    className="controls-buttons_actionEditor-content"
                    caption={translate(actionConfig?.info?.title ?? 'Выбрать')}
                    viewMode="link"
                    onClick={onClickHandler}
                />
            )}
        </LayoutComponent>
    );
});

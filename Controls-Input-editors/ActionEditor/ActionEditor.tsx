import {
    Fragment,
    memo,
    useCallback,
    useMemo,
    useRef,
    RefObject,
    forwardRef,
    LegacyRef,
    ReactElement,
} from 'react';
import { StackOpener } from 'Controls/popup';
import { Button } from 'Controls/buttons';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { default as actions, IActionConfig } from 'Controls-Actions/actions';
import { IActionOptions } from 'Controls-Input/interface';
import { IPropertyGridOptions, PropertyGrid } from 'Controls/propertyGrid';
import { Model } from 'Types/entity';
import * as translate from 'i18n!Controls-Actions';

interface IActionEditorProps extends IPropertyGridPropertyEditorProps<IActionOptions | null> {
    action: any;
    value: IActionOptions;
    LayoutComponent: ReactElement;
}

const CUSTOM_EVENTS = ['onEditingObjectChanged'];
const CAPTION_COLUMN_OPTIONS: IPropertyGridOptions['captionColumnOptions'] = {
    width: 'auto',
    compatibleWidth: 'auto',
};
const ITEMS_CONTAINER_PADDING = {
    top: 'none',
    bottom: 'none',
    left: 'none',
    right: 'none',
};

export const openEditActionsPopup = (
    props: IActionEditorProps,
    opener: HTMLElement,
    applyActionConfigByActionType: Function,
    stackOpener: StackOpener
): void => {
    if (!stackOpener.isOpened()) {
        let resolvedActions: IActionConfig[] = [...actions];

        // todo временное решение для задачи
        // https://online.sbis.ru/opendoc.html?guid=73128494-ce90-4c00-84bb-1a8964574948&client=3
        if (window.location.pathname === '/page/business-card-design') {
            resolvedActions = [actions[0]];
        }

        stackOpener.open({
            template: 'Controls-Input-editors/ActionEditor/ActionEditorPopup:ActionEditorPopup',
            templateOptions: { ...props, actions: resolvedActions },
            width: 400,
            opener,
            eventHandlers: {
                onResult: (item: Model) => {
                    return applyActionConfigByActionType(item);
                },
            },
        });
    }
};

interface IActionEditorPopupProps {
    className?: string;
    editingObjectChangedHandler?: (value: Record<string, unknown>) => void;
    editingObject?: Record<string, unknown>;
    typeDescription?: IPropertyGridOptions['typeDescription'];
}

export const ActionEditorPopupTemplate = forwardRef(function (
    props: IActionEditorPopupProps,
    ref: LegacyRef<HTMLDivElement>
): JSX.Element {
    const editingObjectChangedHandler = useCallback(
        (editingObject: Record<string, unknown>) => {
            props.editingObjectChangedHandler?.(editingObject);
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
                //@ts-ignore
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
    const ref = useRef<HTMLElement>();
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
            onChange?.({
                id: actionType,
            });
        },
        [onChange]
    );
    const clearActionConfig = useCallback(() => {
        onChange?.(null);
    }, []);

    const actionChangedHandler = useCallback((item: Model) => {
        applyActionConfigByActionType(item.get('type'));
    }, []);
    const onClickHandler = useCallback((_) => {
        openEditActionsPopup(props, ref.current as HTMLElement, actionChangedHandler, stackOpener);
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
        const actionProps: Record<string, unknown> =
            value?.actionProps || actionConfig?.commandOptions || {};
        actionProps.hotKey = value?.hotKey;
        return {
            typeDescription: propTypes as IPropertyGridOptions['typeDescription'],
            editingObject: actionProps,
        };
    }, [actionConfig, value]);

    const editingObjectChangedHandler = useCallback(
        (editingObject: Record<string, unknown>) => {
            const tmpActionConfig: IActionOptions = { ...value };
            tmpActionConfig.actionProps = editingObject;
            tmpActionConfig.hotKey = editingObject?.hotKey as IActionOptions['hotKey'];
            delete tmpActionConfig.actionProps?.hotKey;
            onChange?.(tmpActionConfig);
        },
        [value]
    );

    return (
        // @ts-ignore
        <LayoutComponent titlePosition={actionConfig ? 'none' : undefined}>
            {actionConfig ? (
                <ActionEditorPopupTemplate
                    ref={ref as RefObject<HTMLDivElement>}
                    typeDescription={typeDescription}
                    editingObject={editingObject}
                    actionConfig={actionConfig}
                    editingObjectChangedHandler={editingObjectChangedHandler}
                />
            ) : (
                <Button
                    ref={ref as RefObject<HTMLDivElement>}
                    className="controls-buttons_actionEditor-content"
                    caption={translate('Выбрать')}
                    viewMode="link"
                    onClick={onClickHandler}
                />
            )}
        </LayoutComponent>
    );
});

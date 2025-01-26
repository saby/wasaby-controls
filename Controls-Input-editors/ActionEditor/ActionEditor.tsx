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
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { default as actions, IActionConfig } from 'Controls-Actions/actions';
import { IActionOptions } from 'Controls-Input/interface';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import { Model } from 'Types/entity';
import { Selector } from 'FrameEditor/dataObjectFieldList';
import { IFunctionBinding } from 'Frame/base';
import { Feature } from 'Feature/feature';
import * as translate from 'i18n!Controls-Actions';
import { StringType, BooleanType, ObjectType, NumberType, Meta } from 'Meta/types';
import 'css!Controls-Input-editors/ActionEditor/ActionEditor';
import ActionSelectButton from './ActionSelectButton';

interface IActionEditorProps extends IPropertyGridPropertyEditorProps<IActionOptions | null> {
    action: any;
    value: IActionOptions;
    LayoutComponent: ReactElement;
    additionalActions?: IActionOptions[];
    /**
     * Список разрешённых действий. Передаётся action.type
     */
    permittedActions?: string[];
    /**
     * Список избранных действий. Передаётся action.type
     */
    frequentActions?: string[];
    /**
     * Определяет необходимость отключения горячих клавиш
     */
    disableHotKey?: boolean;
}

const ITEMS_CONTAINER_PADDING = {
    top: 'none',
    bottom: 'none',
    left: 'none',
    right: 'none',
};

const blackList = [
    '/page/business-card-design',
    '/page/business-card-settings',
    // Электронное меню:
    '/page/settings-functionality-menu-sale-card',
    '/page/settings-functionality-menu-sale-settings',
    '/page/settings-functionality-menu-sp',
    '/page/settings-functionality-menu-settings',
    // Сайт доставки:
    '/page/settings-functionality-deliverysite-sale-card',
    '/page/settings-functionality-deliverysite-sale-settings',
    '/page/settings-functionality-deliverysite-sp',
    '/page/settings-functionality-deliverysite-settings',
    // Сайт услуг:
    '/page/settings-functionality-sabyservice-sale-card',
    '/page/settings-functionality-sabyservice-sale-settings',
    '/page/settings-functionality-sabyservice-sp',
    '/page/settings-functionality-sabyservice-settings',
    // Клиентские виджеты:
    '/page/clients-widgets-list',
];

export const openEditActionsPopup = (
    props: IActionEditorProps,
    opener: HTMLElement,
    applyActionConfigByActionType: Function,
    stackOpener: StackOpener
): void => {
    if (!stackOpener.isOpened()) {
        const { additionalActions, permittedActions } = props;
        let resolvedActions: IActionConfig[] = [...(additionalActions || []), ...actions];

        // todo временное решение для задачи
        // https://online.sbis.ru/opendoc.html?guid=73128494-ce90-4c00-84bb-1a8964574948&client=3
        // https://online.sbis.ru/opendoc.html?guid=630f8ac4-ffe6-4870-a7bf-2ac014b7a5b0&client=3
        if (blackList.includes(window.location.pathname)) {
            resolvedActions = [actions[0]];
        }

        if (permittedActions) {
            resolvedActions = resolvedActions.filter((action) => {
                return permittedActions.includes(action.type);
            });
        }

        stackOpener.open({
            template: 'Controls-Input-editors/ActionEditor/ActionEditorPopup:ActionEditorPopup',
            templateOptions: { ...props, actions: resolvedActions },
            topPopup: true,
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
    typeDescription?: IActionConfig['propTypes'];
}

const getValidators = (
    validators: string[] | undefined,
    refValue: { current: unknown },
    name: string
) => {
    const result = [];

    if (validators) {
        validators.forEach((validator) => {
            result.push(() => {
                return new Promise((resolve) => {
                    const split = validator.split(':');
                    require([split[0]], (res) => {
                        resolve(res[split[1] || 'default']?.({ value: refValue.current[name] }));
                    }, () => {
                        resolve(true);
                    });
                });
            });
        });
    }

    return result;
};

/**
 * Приводим данные из старого PG к новому
 * @param data
 * @param value
 */
function useFormatData(data: IActionConfig['propTypes'] | undefined, value: unknown) {
    const refValue = useRef(value);
    refValue.current = value;
    return useMemo(() => {
        const properties: Record<string, Meta<unknown>> = {};
        if (data) {
            data.forEach((item, index) => {
                let Type;
                let editorTemplateName = item.editorTemplateName;
                switch (item.type) {
                    case 'string':
                        Type = StringType.clone();
                        if (!editorTemplateName) {
                            editorTemplateName = 'Controls-editors/input:TextEditor';
                        }
                        break;
                    case 'boolean':
                        Type = BooleanType.clone();
                        break;
                    case 'number':
                        Type = NumberType.clone();
                        break;
                    case 'object':
                        Type = ObjectType.clone();
                        break;
                    default:
                        Type = StringType.clone();
                }
                properties[item.name] = Type.id(item.name)
                    .title(item.caption || '')
                    .order(index)
                    .editorProps({
                        ...item.editorOptions,
                        validators: getValidators(item.validators, refValue, item.name),
                    })
                    .defaultValue(item.defaultValue || null)
                    .optional();

                if (editorTemplateName) {
                    properties[item.name] = properties[item.name].editor(
                        'Controls-Input-editors/ActionEditor:BaseEditor',
                        {
                            editorTemplate: editorTemplateName,
                            titlePosition: item.caption ? item.captionPosition : 'none',
                            ...item.editorOptions,
                            validators: getValidators(item.validators, refValue, item.name),
                        }
                    );
                }
            });
        }
        return ObjectType.properties(properties);
    }, [data]);
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
    const data = useFormatData(props.typeDescription, props.editingObject);

    return (
        <div
            className={`controls-buttons_actionEditor_wrapper controls-buttons_actionEditor${
                props.className ? ` ${props.className}` : ''
            }`}
            ref={ref}
        >
            <PropertyGrid
                value={props.editingObject}
                metaType={data}
                onChange={editingObjectChangedHandler}
                itemsContainerPadding={ITEMS_CONTAINER_PADDING}
            />
        </div>
    );
});

const ActionEditorOld = memo((props: IActionEditorProps) => {
    const {
        value,
        onChange,
        LayoutComponent = Fragment,
        additionalActions,
        frequentActions,
        permittedActions,
    } = props;
    const ref = useRef<HTMLElement>();
    const stackOpener = useMemo(() => {
        return new StackOpener();
    }, []);
    const actionConfig = useMemo<IActionConfig | undefined>(() => {
        if (value) {
            return [...(additionalActions || []), ...actions].find((action) => {
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
    }, [onChange]);

    const actionChangedHandler = useCallback(
        (item: Model) => {
            applyActionConfigByActionType(item.get('type'));
        },
        [applyActionConfigByActionType]
    );
    const onClickHandler = useCallback(
        (_) => {
            openEditActionsPopup(
                props,
                ref.current as HTMLElement,
                actionChangedHandler,
                stackOpener
            );
        },
        [openEditActionsPopup]
    );

    const editingObject = useMemo(() => {
        const actionProps: Record<string, unknown> =
            value?.actionProps || actionConfig?.commandOptions || {};
        actionProps.hotKey = value?.hotKey;
        return actionProps;
    }, [actionConfig, value]);

    const typeDescription = useMemo(() => {
        const propTypes = [...(actionConfig?.propTypes || [])];
        if (!props.disableHotKey) {
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
        }
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
                dropdownApplyHandler: applyActionConfigByActionType,
                frequentActions,
                permittedActions,
            },
        });
        return propTypes;
    }, [actionConfig]);

    const editingObjectChangedHandler = useCallback(
        (editingObject: Record<string, unknown>) => {
            const tmpActionConfig: IActionOptions = {
                ...value,
                actionProps: { ...editingObject },
                hotKey: editingObject?.hotKey as IActionOptions['hotKey'],
            };
            delete tmpActionConfig.actionProps?.hotKey;
            if (props.disableHotKey) {
                delete tmpActionConfig.hotKey;
            }
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
                <ActionSelectButton
                    ref={ref as RefObject<HTMLDivElement>}
                    caption={translate('Выбрать')}
                    dropdownApplyHandler={applyActionConfigByActionType}
                    frequentActions={frequentActions}
                    permittedActions={permittedActions}
                    buttonClickHandler={onClickHandler}
                />
            )}
        </LayoutComponent>
    );
});
/**
 * Редактор действия, который позволяет выбрать действие из прикладных объектов/виджетов, доступных в контексте
 */
const ActionEditorNew = memo((props: IActionEditorProps) => {
    const { value, onChange, LayoutComponent = Fragment } = props;

    const applyActionConfigByActionType = useCallback(
        (actionType?: string[]) => {
            onChange?.({
                id: actionType?.join('.') || '',
            });
        },
        [onChange]
    );

    const actionChangedHandler = useCallback(
        (item: { value: IFunctionBinding }) => {
            applyActionConfigByActionType(item?.value.factory.name);
        },
        [applyActionConfigByActionType]
    );
    const selectorProps = useMemo(() => {
        return {
            fieldType: ['Function'],
            labelProperty: ['widgetTitle'],
            iconProperty: ['icon', 'uri'],
            name: 'value',
            value: value.id?.split('.') ?? '',
        };
    }, [value]);
    return (
        // @ts-ignore
        <LayoutComponent>
            <Selector
                onChange={actionChangedHandler}
                LayoutComponent={LayoutComponent}
                {...selectorProps}
            />
        </LayoutComponent>
    );
});
export const ActionEditor = memo((props: IActionEditorProps) => {
    // фича для добавления экспериментального кода по поддержке настройки и запуска новых действий
    const [isFeatureEnabled] = Feature.get(['new-actions']);
    return isFeatureEnabled ? <ActionEditorNew {...props} /> : <ActionEditorOld {...props} />;
});

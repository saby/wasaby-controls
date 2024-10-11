import * as rk from 'i18n!Controls-editors';
import { Fragment, memo, useCallback, useMemo, useRef } from 'react';
import { TreeEditor, TreeEditorInnerContentTemplate } from 'Controls-editors/properties';
import { StickyOpener } from 'Controls/popup';
import { ColumnTemplate } from 'Controls/grid';
import { Button } from 'Controls/buttons';
import {
    IPropertyGridPropertyEditorProps,
    PropertyGridGroupHeader,
} from 'Controls-editors/propertyGrid';
import { IActionOptions, IMenuItem } from 'Controls-Input/interface';
import { Model } from 'Types/entity';
import { showType } from 'Controls/toolbars';
import { openStackPopupWithActions, getActionByModel } from './Utils';
import { IconEditor } from './IconEditor';
import 'css!Controls-Input-editors/ActionsListEditor/ActionsListEditor';

interface IActionsListOptions {
    items: IMenuItem[];
    selectedKeys?: string[];
}

interface IActionsListEditorProps extends IPropertyGridPropertyEditorProps<IActionOptions> {
    value: IActionsListOptions;
}

interface IEditableMenuItemProps {
    title: string;
    icon: string;
    actionProps: unknown;
}

const ITEM_ACTION = {
    id: 'configuration',
    icon: 'icon-TFSettings',
    showType: showType.TOOLBAR,
    iconStyle: 'secondary',
    iconSize: 'm',
    tooltip: rk('Настроить'),
};

function TitleTemplate(props): JSX.Element | null {
    const onPropertyValueChanged = useCallback(
        (event: Event, icon: string) => {
            props.item.contents.set('icon', icon);
        },
        [props.item.contents]
    );
    return (
        <ColumnTemplate
            {...props}
            contentTemplate={
                <div className="ws-flexbox ws-align-items-baseline">
                    {props.item.contents.get('icon') ? (
                        <Button
                            className="controls-ActionsListEditor__icon controls-background-unaccented controls-margin_left-s"
                            viewMode="squared"
                            contrastBackground={true}
                            icon={props.item.contents.get('icon')}
                            iconSize="s"
                            iconStyle="secondary"
                        />
                    ) : (
                        <IconEditor
                            onPropertyValueChanged={onPropertyValueChanged}
                            className="controls-margin_left-s"
                        />
                    )}
                    {!props.item.isEditing() ? (
                        <>
                            <span className="controls-margin_left-xs controls-margin_right-xs">
                                {props.item.contents.get('title')}
                            </span>
                            {props.expanderTemplate && <props.expanderTemplate />}
                        </>
                    ) : (
                        <TreeEditorInnerContentTemplate
                            {...props}
                            editorPlaceholder={rk('Введите название папки')}
                        />
                    )}
                </div>
            }
        />
    );
}

export const ActionsListEditor = memo((props: IActionsListEditorProps) => {
    const { onChange, LayoutComponent = Fragment } = props;
    const buttonRef = useRef();
    const treeRef = useRef();
    const columns = useMemo(() => {
        return [
            {
                template: TitleTemplate,
                displayProperty: 'title',
                fontSize: 'm',
                valign: 'center',
            },
        ];
    }, []);

    const stickyOpener = useMemo(() => {
        return new StickyOpener();
    }, []);

    const openStickyPopup = useCallback(
        (selectedAction: IActionOptions) => {
            stickyOpener.open({
                topPopup: true,
                opener: treeRef.current,
                target: treeRef.current,
                template:
                    'Controls-Input-editors/ActionsListEditor/ActionsListEditorPopup:ActionsListEditorPopup',
                width: 400,
                closeOnOutsideClick: false,
                templateOptions: {
                    ...props,
                    parentRef: treeRef,
                    actionConfig: selectedAction,
                },
                eventHandlers: {
                    onResult: (action) => {
                        return onApplyAction(action);
                    },
                },
            });
        },
        [props.value]
    );

    const applyActionConfigByActionType = useCallback(
        (item: Model) => {
            const selectedAction = getActionByModel(item);
            selectedAction.id = item.get('id');
            const actionProps = item.get('action')?.actionProps || selectedAction.commandOptions;
            selectedAction.actionProps = {
                ...actionProps,
                title: item.get('title'),
                icon: item.get('icon'),
            };
            if (selectedAction.id) {
                // Если редактирование
                openStickyPopup(selectedAction);
            } else {
                const menuItem = createMenuItemByAction(selectedAction);
                onChange({
                    items: [...(props.value.items || []), menuItem],
                });
            }
        },
        [props.value]
    );

    const itemActions = useMemo(() => {
        const defaultItemActions = { ...ITEM_ACTION };
        defaultItemActions.handler = (item) => {
            applyActionConfigByActionType(item);
        };
        return [defaultItemActions];
    }, [applyActionConfigByActionType]);

    const itemActionVisibilityCallback = useCallback(
        (actionItem, action, item) => {
            return !item.get('node') || item.get('title') || action.id !== 'configuration';
        },
        [props.value]
    );

    const onAddAction = useCallback(() => {
        openStackPopupWithActions(buttonRef, applyActionConfigByActionType, props);
    }, [props.value]);

    const onAddFolder = useCallback(() => {
        treeRef.current.beginAdd({
            item: new Model({
                keyProperty: 'id',
                rawData: {
                    id: Date.now(),
                    title: '',
                    icon: '',
                    parent: null,
                    node: true,
                },
            }),
        });
    }, []);

    const onApplyAction = useCallback(
        (action) => {
            if (action.id) {
                // Если редактирование
                stickyOpener.close();
                const items = props.value.items.map((item) => {
                    if (item.id === action.id) {
                        return {
                            ...item,
                            title: action.actionProps.title,
                            icon: action.actionProps.icon,
                            action: {
                                id: action.type,
                                actionProps: action.actionProps || action.commandOptions,
                            },
                        };
                    }
                    return item;
                });
                onChange({
                    items,
                });
            } else {
                const menuItem = createMenuItemByAction(action);
                onChange({
                    items: [...(props.value.items || []), menuItem],
                });
            }
        },
        [props.value.items]
    );

    return (
        <LayoutComponent>
            {!!props.groupCaption ? (
                <div className={'controls-ActionsListEditor_heading-caption'}>
                    <PropertyGridGroupHeader title={props.groupCaption} />
                    <Button
                        className="controls-margin_left-s"
                        viewMode="filled"
                        buttonStyle="pale"
                        icon="icon-AddButtonNew"
                        tooltip={rk('Добавить действие')}
                        ref={buttonRef}
                        onClick={onAddAction}
                    />
                    <Button
                        className="controls-margin_left-s"
                        viewMode="filled"
                        buttonStyle="pale"
                        icon="icon-CreateFolder"
                        tooltip={rk('Добавить папку')}
                        onClick={onAddFolder}
                    />
                </div>
            ) : null}
            <TreeEditor
                {...props}
                columns={columns}
                groupCaption={null}
                keyProperty="id"
                itemActions={itemActions}
                expanderPosition="custom"
                ref={treeRef}
                checkboxVisibility="hidden"
                className="controls-margin_top-2xs"
                itemActionVisibilityCallback={itemActionVisibilityCallback}
            />
        </LayoutComponent>
    );
});

function createMenuItemByAction(action): IMenuItem {
    return {
        id: Date.now(),
        title: action.actionProps.title,
        icon: action.actionProps.icon,
        action: {
            id: action.type,
            actionProps: action.actionProps || action.commandOptions,
        },
        parent: null,
        node: null,
    };
}

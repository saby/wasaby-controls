import { Fragment, memo, useRef, useState } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { Button } from 'Controls/buttons';
import { Icon } from 'Controls/icon';
import { Title } from 'Controls/heading';
import { StackOpener } from 'Controls/popup';
import { IActionConfigOptions } from 'Controls/interface';
import { Model } from 'Types/entity';
import * as rk from 'i18n!Controls-editors';
import 'css!Controls-editors/_properties/ActionEditor/ActionEditor';

const ACTIONS: IActionConfigOptions[] = [
    {
        source: 'datamap',
        path: ['ЛИД', 'ОтправитьКП'],
    },
];

interface IActionEditorValue {
    onClick?: IActionConfigOptions;
}

interface IActionEditorProps extends IPropertyEditorProps<IActionEditorValue> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: IActionEditorValue;
    placeholder?: string;
}

/**
 * Реакт компонент, редактор действия
 * @class Controls-editors/_properties/ActionEditor
 * @public
 */
export const ActionEditor = memo((props: IActionEditorProps) => {
    const { onChange, value = {}, LayoutComponent = Fragment } = props;
    // eslint-disable-next-line react/hook-use-state
    const [stackOpener] = useState<StackOpener>(new StackOpener());

    const propsRef = useRef(props);
    propsRef.current = props;

    const applyActionConfigByActionType = (actionType: string): void => {
        const onClick = ACTIONS.find(({ path }) => {
            return path[path.length - 1] === actionType;
        });
        onChange({ onClick });
    };

    // TODO: transfer template component to _properties lib
    const onClickHandler = () => {
        if (!stackOpener.isOpened()) {
            stackOpener.open({
                template: 'Controls-editors/_properties/ActionEditor/ActionsEditorPopup',
                templateOptions: {
                    actions: ACTIONS,
                    onSendResult: (item: Model) => {
                        return applyActionConfigByActionType(item.get('type'));
                    },
                    onClose: () => {
                        return stackOpener.close();
                    },
                },
                width: 400,
                opener: this,
                eventHandlers: {
                    onResult: (item: Model) => {
                        return applyActionConfigByActionType(item.get('type'));
                    },
                },
            });
        }
    };

    const clearActionConfig = () => {
        onChange({ onClick: null });
    };

    const actionComponent = () => {
        const { onClick } = props.value;
        return (
            <div className="controls-ActionEditor-wrapper ws-flexbox ws-justify-content-between space-between ws-align-items-baseline">
                <Title
                    className="controls-margin_bottom-s"
                    caption={onClick.path[onClick.path.length - 1]}
                    fontColorStyle="default"
                    fontSize="m"
                    readOnly={true}
                    fontWeight="normal"
                    data-qa="controls-PropertyGrid__editor_action"
                />
                <div className="controls-ActionEditor-buttons">
                    <Button
                        className="controls-margin_right-xs"
                        onClick={onClickHandler}
                        viewMode="ghost"
                        icon="icon-Edit"
                        inlineHeight="m"
                        iconSize="m"
                    />
                    <Icon
                        onClick={clearActionConfig}
                        icon="icon-Trash-bucket"
                        iconStyle="danger"
                        iconSize="m"
                    />
                </div>
            </div>
        );
    };

    return (
        <LayoutComponent>
            {value?.onClick ? (
                actionComponent()
            ) : (
                <span>
                    <Button
                        caption={rk('Добавьте команду')}
                        onClick={onClickHandler}
                        viewMode="link"
                    />
                    , {rk('которая будет выполняться по клику на кнопку')}
                </span>
            )}
        </LayoutComponent>
    );
});

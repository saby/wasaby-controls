import { Fragment, memo, useRef, useState, useContext } from 'react';
import * as rk from 'i18n!Controls';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { Button } from 'Controls/buttons';
import { StackOpener } from 'Controls/popup';
import { IActionOptions } from 'Controls-Buttons/interface';
import { ActionItem } from './ActionEditor/ActionItem';
import { DataContext } from 'Controls-DataEnv/context';
import 'css!Controls-Buttons-editors/ActionEditor/ActionEditor';

interface IActionEditorProps extends IPropertyEditorProps<IActionOptions> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: IActionOptions;
    placeholder?: string;
}

/**
 * Редактор действий {@link Controls-Buttons/buttonConnected:Button кнопки} для {@link Controls-editors/propertyGrid:PropertyGrid PropertyGrid}
 * @class Controls-Buttons-editors/ActionEditor
 * @public
 */
export const ActionEditor = memo((props: IActionEditorProps) => {
    const { onChange, value = { actionProps: {}, id: null }, LayoutComponent = Fragment } = props;
    // eslint-disable-next-line react/hook-use-state
    const [stackOpener] = useState<StackOpener>(new StackOpener());
    const dataContext = useContext(DataContext);

    const nodeRef = useRef();

    const propsRef = useRef(props);
    propsRef.current = props;

    const onClickHandler = () => {
        if (!stackOpener.isOpened()) {
            stackOpener.open({
                template: 'Controls-Buttons-editors/ActionsEditorPopup',
                templateOptions: {
                    onSendResult: onChange,
                    onClose: () => {
                        return stackOpener.close();
                    },
                    dataContext,
                    value,
                },
                width: 400,
                opener: nodeRef.current,
                eventHandlers: {
                    onResult: onChange,
                },
            });
        }
    };

    const clearActionConfig = () => {
        onChange({
            actionProps: {},
            id: null,
        });
    };

    return (
        <LayoutComponent title={null}>
            <div ref={nodeRef}>
                {isActionSelected(value) ? (
                    <ActionItem
                        id={value.id}
                        onClick={onClickHandler}
                        onClear={clearActionConfig}
                    />
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
            </div>
        </LayoutComponent>
    );
});

function isActionSelected(value: IActionOptions): boolean {
    return !!value.id;
}
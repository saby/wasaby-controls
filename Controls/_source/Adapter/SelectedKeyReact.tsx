/**
 * @kaizen_zone 8a2f8618-6b1b-4b55-b068-17efcaa90c9b
 */
import { IControlOptions } from 'UI/Base';
import * as React from 'react';

export interface ISelectedKeyAdapterOptions extends IControlOptions {
    selectedKey?: TSelectedKey;
    onSelectedKeyChanged?: (selectedKey: TSelectedKey) => void;
}

type TSelectedKey = string | number;
type TSelectedKeys = TSelectedKey[];
/**
 * Контейнер для контролов, реализующих интерфейс {@link Controls/_interface/IMultiSelectable multiSelectable}.
 * Контейнер получает параметр selectedKey и передает новое значение в опцию selectedKeys дочерним контролам.
 * Получает результат дочернего события "selectedKeysChanged" и уведомляет о событии "selectedKeyChanged".
 * @class Controls/_source/Adapter/SelectedKey
 * @extends Controls/Control
 * @implements Controls/interface:ISingleSelectable
 *
 * @public
 *
 * @example
 * Пример использования с контролом {@link Controls.dropdown:Selector}
 * <pre>
 * <Controls.source:SelectedKey bind:selectedKey="_value">
 *    <Controls.dropdown:Selector keyProperty='key'
 *                             displayProperty='title'
 *                             source='{{_source}}'/>
 * </Controls.source:SelectedKey>
 * </pre>
 * <pre>
 *    _source: null,
 *    _value: '1',
 *    _beforeMount: function() {
 *        this._source = new source.Memory ({
 *           data: [
 *                   { key: 1, title: 'Project', group: 'Select' },
 *                   { key: 2, title: 'Work plan', group: 'Select' },
 *                   { key: 3, title: 'Task', group: 'Select' },
 *               ],
 *           keyProperty: 'key'
 *        });
 *   }
 * </pre>
 */

/*
 * Container for controls that implement interface {@link Controls/_interface/IMultiSelectable multiSelectable}.
 * Container receives selectedKey option and transfers selectedKeys option to children.
 * Listens for children "selectedKeysChanged" event and notify event "selectedKeyChanged".
 * @class Controls/_source/Adapter/SelectedKey
 * @extends Controls/Control
 * @implements Controls/interface:ISingleSelectable
 *
 * @public
 * @author Золотова Э.Е.
 */

const SelectedKeyAdapter = React.forwardRef(
    ({ selectedKey, onSelectedKeyChanged, onSelectedkeyschanged, ...props }, ref) => {
        const selectedKeys: TSelectedKeys = React.useMemo(() => {
            return selectedKey === null || selectedKey === undefined ? [] : [selectedKey];
        }, [selectedKey]);
        const onSelectedKeysChanged = React.useCallback(
            (e, keys) => {
                // Обработчики вызвают по-разному, то с событием, то без
                if (e instanceof Array) {
                    keys = e;
                }
                const selectedKey = keys.length ? keys[0] : null;
                onSelectedKeyChanged?.(selectedKey);
            },
            [onSelectedKeyChanged]
        );
        if (props.children) {
            let className = props.className || '';
            if (props.children.props.className) {
                className += ' ' + props.children.props.className;
            }
            return React.cloneElement(props.children, {
                ...props,
                className,
                selectedKeys,
                onSelectedkeyschanged: null,
                onSelectedKeysChanged,
                ref,
                forwardedRef: ref,
            });
        } else if (props.content) {
            <props.content
                {...props}
                selectedKeys={selectedKeys}
                onSelectedKeysChanged={onSelectedKeysChanged}
                ref={ref}
                forwardedRef={ref}
            />;
        }
        return null;
    }
);
export default SelectedKeyAdapter;

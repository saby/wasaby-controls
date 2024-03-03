import { forwardRef, ReactElement, useCallback, useState, CSSProperties, useMemo } from 'react';
import { IFontSizeOptions, IHeightOptions } from 'Controls/interface';
import 'css!Controls/beautifulToggle';

export interface IBeautifulToggleProps extends IFontSizeOptions, IHeightOptions {
    items: IToggleItem[];
    selectedKey?: string;
    onSelectedKeyChanged?: Function;
}

interface IToggleItem {
    id: boolean | string | number;
    caption: string;
}

interface IToggleItemProps extends IFontSizeOptions, IHeightOptions, IToggleItem {
    selectedKey: string;
    onItemClick: Function;
}

function ToggleItem({
    caption,
    selectedKey,
    onItemClick,
    fontSize,
    inlineHeight,
    id,
}: IToggleItemProps): ReactElement {
    const [style, setStyle] = useState<CSSProperties>({});
    const isSelected = useMemo(() => id === selectedKey, [id, selectedKey]);

    const { onMouseMove, onMouseLeave } = useMemo(() => {
        return {
            onMouseLeave: () => {
                const newStyle = {};
                newStyle['--button-cursor-position'] = '50%';
                setStyle(newStyle);
            },
            onMouseMove: (event) => {
                const { nativeEvent, currentTarget } = event;
                const newStyle = {};
                newStyle['--button-cursor-position'] =
                    (nativeEvent.offsetX / currentTarget.offsetWidth) * 100 + '%';
                setStyle(newStyle);
            },
        };
    }, []);

    const onItemClickHandler = useCallback(() => {
        if (!isSelected) {
            onItemClick(id);
        }
    }, [isSelected, onItemClick]);

    return (
        <div
            style={isSelected ? style : null}
            className={`controls-fontsize-${fontSize}
                        controls-inlineheight-${inlineHeight}`}
            onClick={onItemClickHandler}
            onMouseMove={isSelected ? onMouseMove : null}
            onMouseLeave={isSelected ? onMouseLeave : null}
        >
            <span
                className={`controls-BeautifulToggle_caption
                        controls-BeautifulToggle_caption_${isSelected ? 'selected' : 'unselected'}`}
            >
                {caption}
            </span>
        </div>
    );
}

/**
 * Графический контрол, который предоставляет пользователю возможность отображения переключателя с маркером.
 * @class Controls/beautifulToggle
 * @implements Controls/interface:ICheckable
 *
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.beautifulToggle items="{{_items}}"
 *                           bind:selectedKey="_selectedKey">
 * </Controls.beautifulToggle>
 * </pre>
 *
 * <pre class="brush: js">
 *     protected _items = [
 *          {
 *              id: 'cash',
 *              caption: 'Наличными',
 *          }, {
 *              id: 'card',
 *              caption: 'По карте'
 *          }
 *     ];
 * </pre>
 *
 * @public
 * @demo Controls-demo/BeautifulToggle/Index
 */
export default forwardRef(function BeautifulToggle(
    props: IBeautifulToggleProps,
    ref
): ReactElement<IBeautifulToggleProps> {
    const { fontSize = 'm', inlineHeight = 'm' } = props;

    const onSelectedKeyChanged = useCallback(
        (value) => {
            props.onSelectedKeyChanged?.(value);
        },
        [props.selectedKey, props.onSelectedKeyChanged]
    );

    const itemTemplates = [];
    if (props.items) {
        props.items.forEach((item) => {
            itemTemplates.push(
                <ToggleItem
                    key={`beautifulToggle-item-${item.id}`}
                    fontSize={fontSize}
                    inlineHeight={inlineHeight}
                    selectedKey={props.selectedKey}
                    id={item.id}
                    caption={item.caption}
                    onItemClick={onSelectedKeyChanged}
                />
            );
        });
    }

    return (
        <div
            ref={ref}
            {...props.attrs}
            className={`controls-BeautifulToggle ${
                props.className || props.attrs?.className || ''
            }`}
        >
            {itemTemplates}
        </div>
    );
});

/**
 * @name Controls/beautifulToggle#items
 * @cfg {TItem[]} Набор элементов переключателя
 */

/**
 * @typedef {Object} TItem
 * @property {String} id Идентификатор элемента
 * @property {String} caption Текст элемента переключателя
 */

/**
 * @name Controls/beautifulToggle#selectedKey
 * @cfg {string} Ключ выбранной записи
 */

/**
 * @name Controls/beautifulToggle#selectedKeyChanged
 * @event Происходит при изменении выбранного значения.
 * @param {String} selectedKey Ключ выбранного элемента.
 */

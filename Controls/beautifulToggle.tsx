import { forwardRef, ReactElement, useCallback, useState, CSSProperties, useMemo } from 'react';
import { IFontSizeOptions, IHeightOptions } from 'Controls/interface';
import 'css!Controls/beautifulToggle';

export interface IBeautifulToggleProps extends IFontSizeOptions, IHeightOptions {
    offCaption?: string;
    onCaption?: string;
    value?: boolean;
    onValueChanged?: Function;
}

interface IToggleItemProps extends IFontSizeOptions, IHeightOptions {
    caption: string;
    isSelected: boolean;
    onItemClick: Function;
}

function ToggleItem({
    caption,
    isSelected,
    onItemClick,
    fontSize,
    inlineHeight,
}: IToggleItemProps): ReactElement {
    const [style, setStyle] = useState<CSSProperties>({});

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
            onItemClick();
        }
    }, [isSelected, onItemClick]);

    return (
        <div
            style={isSelected ? style : null}
            className={`controls-BeautifulToggle_caption
                        controls-BeautifulToggle_caption_${isSelected ? 'selected' : 'unselected'}
                        controls-fontsize-${fontSize}
                        controls-inlineheight-${inlineHeight}`}
            onClick={onItemClickHandler}
            onMouseMove={isSelected ? onMouseMove : null}
            onMouseLeave={isSelected ? onMouseLeave : null}
        >
            {caption}
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
 * <Controls/beautifulToggle onCaption="Наличными"
 *                           offCaption="По карте"
 *                           bind:value="_value">
 * </Controls/beautifulToggle>
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

    const onValueChanged = useCallback(
        (value) => {
            props.onValueChanged?.(!props.value);
        },
        [props.value, props.onValueChanged]
    );

    return (
        <div
            ref={ref}
            {...props.attrs}
            className={`controls-BeautifulToggle ${
                props.className || props.attrs?.className || ''
            }`}
        >
            <ToggleItem
                fontSize={fontSize}
                inlineHeight={inlineHeight}
                isSelected={props.value}
                caption={props.onCaption}
                onItemClick={onValueChanged}
            />
            <ToggleItem
                fontSize={fontSize}
                inlineHeight={inlineHeight}
                isSelected={!props.value}
                caption={props.offCaption}
                onItemClick={onValueChanged}
            />
        </div>
    );
});

/**
 * @name Controls/beautifulToggle#onCaption
 * @cfg {String} Подпись у активного состояния.
 */

/**
 * @name Controls/beautifulToggle#offCaption
 * @cfg {String} Подпись у не активного состояния.
 */

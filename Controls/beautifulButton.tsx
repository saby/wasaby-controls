/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
import { forwardRef, ReactElement, useState, CSSProperties, SyntheticEvent } from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { ButtonTemplate } from 'Controls/buttons';
import { TInternalProps } from 'UICore/Executor';
import { useReadonly } from 'UI/Contexts';
import {
    IControlProps,
    ICaptionOptions,
    IFontColorStyleOptions,
    IFontSizeOptions,
    IHeightOptions,
    IHrefOptions,
    ITooltipOptions,
} from 'Controls/interface';
import 'css!Controls/beautifulButton';

interface IButtonProps extends IControlProps,
    IHrefOptions,
    ICaptionOptions,
    IFontColorStyleOptions,
    IFontSizeOptions,
    IHeightOptions,
    ITooltipOptions,
    TInternalProps {
    onClick?: (event: SyntheticEvent<HTMLElement, MouseEvent>) => void;
    onTouchStart?: (event: SyntheticEvent<HTMLElement, TouchEvent>) => void;
    onMouseDown?: (event: SyntheticEvent<HTMLElement, MouseEvent>) => void;
    onMouseEnter?: (event: SyntheticEvent<HTMLElement, MouseEvent>) => void;
    onMouseOver?: (event: SyntheticEvent<HTMLElement, MouseEvent>) => void;
    onMouseMove?: (event: SyntheticEvent<HTMLElement, MouseEvent>) => void;
    onMouseLeave?: (event: SyntheticEvent<HTMLElement, MouseEvent>) => void;
    onKeyPress?: (event: SyntheticEvent<HTMLElement, KeyboardEvent>) => void;
    onKeyDown?: (event: SyntheticEvent<HTMLElement, KeyboardEvent>) => void;
}

/**
 * Графический контрол, который предоставляет пользователю возможность отображения кнопки с маркером.
 * @class Controls/beautifulButton
 * @mixes Controls/buttons:IClick
 * @implements Controls/interface:IHref
 * @implements Controls/interface:ICaption
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:ITooltip
 *
 * @public
 * @demo Controls-demo/BeautifulButtons/Index
 */
export default forwardRef(function BeautifulButton(props: IButtonProps, ref): ReactElement<IButtonProps> {
    const {fontSize = 'm', inlineHeight = 'm'} = props;
    const [style, setStyle] = useState<CSSProperties>(() => {
        return props.style || props.attrs?.style || {};
    });
    const readOnly = useReadonly(props);

    const onMouseMove = (event: SyntheticEvent<HTMLElement, MouseEvent>) => {
        if (!readOnly) {
            const {nativeEvent, currentTarget} = event;
            const newStyle = {...style};
            newStyle['--button-cursor-position'] = (nativeEvent.offsetX / currentTarget.offsetWidth * 100) + '%';
            setStyle(newStyle);
        }
        props.onMouseMove?.(event);
    };
    const onMouseLeave = (event: SyntheticEvent<HTMLElement, MouseEvent>) => {
        if (!readOnly) {
            const newStyle = {...style};
            newStyle['--button-cursor-position'] = '50%';
            setStyle(newStyle);
        }
        props.onMouseLeave?.(event);
    };

    const attrs = wasabyAttrsToReactDom(props.attrs) || {};
    return <ButtonTemplate
        {...attrs}
        ref={ref}
        style={style}
        _viewMode='beautiful'
        _options={props}
        _byttonStyle='primary'
        _contrastBackground={false}
        _height={inlineHeight}
        _fontSize={fontSize}
        _fontColorStyle={props.fontColorStyle}
        _caption={props.caption}
        _stringCaption={true}
        _tooltip={props.tooltip}
        _hasIcon={false}
        readOnly={readOnly}
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
        onKeyPress={props.onKeyPress}
        onTouchStart={props.onTouchStart}
        onMouseDown={props.onMouseDown}
        onMouseOver={props.onMouseOver}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onKeyDown={props.onKeyDown}
    />;
});

export {
    IButtonProps,
};

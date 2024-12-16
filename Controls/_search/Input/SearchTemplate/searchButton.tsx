import * as React from 'react';
import { useTheme, useReadonly } from 'UI/Contexts';
import { TInternalProps, wasabyAttrsToReactDom } from 'UICore/Executor';
import { SyntheticEvent } from 'Vdom/Vdom';
import { ICaptionOptions, IControlProps, IHeightOptions } from 'Controls/interface';
import { ISearchInputOptions } from '../Search';

interface ISearchButtonTemplateOptions
    extends TInternalProps,
        IControlProps,
        ICaptionOptions,
        ISearchInputOptions,
        IHeightOptions {
    onSearchClick: (event: SyntheticEvent) => void;
}

export default React.forwardRef(function SearchButtonTemplate(
    props: ISearchButtonTemplateOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement<ISearchButtonTemplateOptions, string> {
    const readOnly = useReadonly(props);
    const theme = useTheme(props);
    const attrs = wasabyAttrsToReactDom(props.attrs) || {};
    const style = attrs.style || props.style;
    return (
        <div
            ref={ref}
            {...attrs}
            style={style}
            data-qa={attrs['data-qa'] || props['data-qa'] || 'Search__searchButton'}
            className={`
                    controls_search_theme-${theme} controls-Search__button
                    controls-Search__button_${readOnly ? 'readOnly' : 'enabled'}
                    controls-Search__searchButton
                    controls-Search__searchButton_iconSize-${props.iconSize}
                    controls-Search__searchButton-${props.searchButtonAlign}_inlineheight-${
                props.inlineHeight
            }
                    controls-Search__searchButton_position-${props.searchButtonAlign}
                    ${
                        props.searchButtonIconStyle
                            ? 'controls-icon_style-' + props.searchButtonIconStyle
                            : 'controls-Search__searchButton_color' + (readOnly ? '_readOnly' : '')
                    }
                    ${props.searchButtonAlign === 'right' ? 'icon-Search2' : 'icon-Search3'}
                    ${props.className}`}
            onMouseDown={props.onSearchClick}
            ws-no-focus={'true'}
        ></div>
    );
});

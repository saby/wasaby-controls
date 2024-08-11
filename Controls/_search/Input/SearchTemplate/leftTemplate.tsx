import * as React from 'react';
import { useTheme } from 'UI/Contexts';
import { TInternalProps } from 'UICore/Executor';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IFieldTemplateOptions } from 'Controls/input';
import { ICaptionOptions, IControlProps, IHeightOptions } from 'Controls/interface';
import { ISearchInputOptions } from '../Search';
import SearchButtonTemplate from './searchButton';

interface ISearchButtonTemplateOptions extends TInternalProps, IControlProps, ICaptionOptions {
    options: ISearchInputOptions & IFieldTemplateOptions & IHeightOptions;
    onSearchClick: (event: SyntheticEvent) => void;
    getIconSize: (height: string) => void;
}

export default React.forwardRef(function SearchButtonLeftTemplate(
    props: ISearchButtonTemplateOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement<ISearchButtonTemplateOptions, string> {
    const theme = useTheme(props);
    return (
        <div className={`controls_search_theme-${theme} controls-Search__buttons`} ref={ref}>
            {props.options.leftFieldTemplate ? <props.options.leftFieldTemplate /> : null}

            {props.options.searchButtonAlign === 'left' && props.options.searchButtonVisible ? (
                <SearchButtonTemplate
                    searchButtonAlign={props.options.searchButtonAlign}
                    searchButtonIconStyle={props.options.searchButtonIconStyle}
                    iconSize={
                        props.options.iconSize || props.getIconSize(props.options.inlineHeight)
                    }
                    inlineHeight={props.options.inlineHeight}
                    onSearchClick={props.onSearchClick}
                />
            ) : null}
        </div>
    );
});

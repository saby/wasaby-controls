import * as React from 'react';
import { useTheme, useReadonly } from 'UI/Contexts';
import { TInternalProps } from 'UICore/Executor';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IFieldTemplateOptions } from 'Controls/input';
import { ICaptionOptions, IControlProps, IHeightOptions } from 'Controls/interface';
import { ISearchInputOptions } from '../Search';
import SearchButtonTemplate from './searchButton';
import rk = require('i18n!Controls');

interface ISearchButtonTemplateOptions extends TInternalProps, IControlProps, ICaptionOptions {
    options: ISearchInputOptions & IFieldTemplateOptions & IHeightOptions;
    onSearchClick: (event: SyntheticEvent) => void;
    onResetClick: (event: SyntheticEvent) => void;
    onResetMousedown: (event: SyntheticEvent) => void;
    getIconSize: (height: string) => void;
    isVisibleReset: () => boolean;
}

export default React.forwardRef(function SearchButtonRightTemplate(
    props: ISearchButtonTemplateOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement<ISearchButtonTemplateOptions, string> {
    const readOnly = useReadonly(props);
    const theme = useTheme(props);
    return (
        <div className={`controls_search_theme-${theme} controls-Search__buttons`} ref={ref}>
            {props.isVisibleReset() && props.options.resetButtonVisible ? (
                <div
                    title={rk('Очистить')}
                    className={`controls-Search__button
                            controls-Search__button_${readOnly ? 'readOnly' : 'enabled'}
                            controls-Search__resetButton
                            controls-Search__resetButton_position
                            controls-Search__resetButton_color icon-Close`}
                    onClick={props.onResetClick}
                    onMouseDown={props.onResetMousedown}
                    ws-no-focus={'true'}
                    data-qa="Search__resetButton"
                ></div>
            ) : null}

            {props.options.rightFieldTemplate ? (
                <props.options.rightFieldTemplate onSearchClick={props.onSearchClick} />
            ) : null}

            {props.options.searchButtonAlign !== 'left' && props.options.searchButtonVisible ? (
                <SearchButtonTemplate
                    searchButtonAlign={props.options.searchButtonAlign}
                    searchButtonIconStyle={props.options.searchButtonIconStyle}
                    iconSize={
                        props.options.iconSize || props.getIconSize(props.options.inlineHeight)
                    }
                    readOnly={readOnly}
                    inlineHeight={props.options.inlineHeight}
                    onSearchClick={props.onSearchClick}
                />
            ) : null}
        </div>
    );
});

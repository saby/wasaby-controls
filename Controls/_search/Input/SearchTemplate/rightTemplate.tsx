import * as React from 'react';
import { useTheme, useReadonly } from 'UI/Contexts';
import { TInternalProps } from 'UICore/Executor';
import { SyntheticEvent } from 'UI/Events';
import { IFieldTemplateOptions } from 'Controls/input';
import { ICaptionOptions, IComponentPropsWithReadonly, IHeightOptions } from 'Controls/interface';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { ISearchInputOptions } from '../Search';
import SearchButtonTemplate from './searchButton';
import rk = require('i18n!Controls');
import { detection } from 'Env/Env';

interface ISearchButtonTemplateOptions
    extends TInternalProps,
        IComponentPropsWithReadonly,
        ICaptionOptions {
    options: ISearchInputOptions & IFieldTemplateOptions & IHeightOptions;
    onSearchClick: (event: SyntheticEvent) => void;
    onResetClick: (event: SyntheticEvent) => void;
    onResetMousedown: (event: SyntheticEvent) => void;
    getIconSize: (height: string) => void;
    isVisibleReset: () => boolean;
    isVisibleSearchButton: () => boolean;
}

export default React.forwardRef(function SearchButtonRightTemplate(
    props: ISearchButtonTemplateOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement<ISearchButtonTemplateOptions, string> {
    const readOnly = useReadonly(props);
    const theme = useTheme(props);
    const onSearchClick = React.useCallback((event: SyntheticEvent) => {
        if (props.onSearchClick) {
            props.onSearchClick(event);
        }
        loadAsync('CloudStatisticsHelper/cloudStatisticsHelper')
            .then((statisticModule: any) => {
                statisticModule.sendCloudStatistic({
                    functionality: 'Строка поиска',
                    context: 'Иконка лупы в строке поиска',
                    action: detection.isMobileIOS ? 'Клик по кнопке на ios' : 'Клик по кнопке',
                });
            })
            .catch((e) => null);
    }, []);
    return (
        <div
            className={`controls_search_theme-${theme} controls-Search__buttons controls-Search__buttons-rightTemplate`}
            ref={ref}
        >
            {props.options.resetButtonVisible ? (
                <div
                    title={rk('Очистить')}
                    className={`controls-Search__button
                            ${
                                !props.isVisibleReset()
                                    ? 'controls-Search__resetButton-invisible'
                                    : ''
                            }
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

            {props.options.searchButtonAlign !== 'left' &&
            props.options.searchButtonVisible &&
            props.isVisibleSearchButton() ? (
                <SearchButtonTemplate
                    searchButtonAlign={props.options.searchButtonAlign}
                    searchButtonIconStyle={props.options.searchButtonIconStyle}
                    iconSize={
                        props.options.iconSize || props.getIconSize(props.options.inlineHeight)
                    }
                    readOnly={readOnly}
                    inlineHeight={props.options.inlineHeight}
                    onSearchClick={onSearchClick}
                />
            ) : null}
        </div>
    );
});

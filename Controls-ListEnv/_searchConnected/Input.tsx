import * as React from 'react';
import { Input, ISearchIconOptions } from 'Controls/search';
import { InputSearchContextResolver } from 'Controls/search';
import { IControlOptions } from 'UI/Base';
import { useReadonly } from 'UI/Contexts';
import { useSearchConnectedFocus } from './hooks/searchConnectedHooks';
import {
    IStoreIdOptions,
    IFontColorStyleOptions,
    IFontSizeOptions,
    IFontWeightOptions,
    IHeightOptions,
    IInputPlaceholderOptions,
    IContrastBackgroundOptions,
} from 'Controls/interface';
import { IFieldTemplateOptions, IPaddingOptions, ITextOptions } from 'Controls/input';

export interface ISearchInputOptions
    extends IControlOptions,
        IStoreIdOptions,
        IFontColorStyleOptions,
        IFontSizeOptions,
        IFontWeightOptions,
        IHeightOptions,
        IInputPlaceholderOptions,
        ITextOptions,
        IPaddingOptions,
        IFieldTemplateOptions,
        ISearchIconOptions,
        IContrastBackgroundOptions {
    tooltip?: string;
}

const customEvents = ['onInputCompleted', 'onResetClick'];

const InputContent = React.forwardRef((props, ref) => {
    return <Input {...props} forwardedRef={ref} />;
});

/**
 * Контрол представляет собой текстовое поле, предназначенное для ввода поисковых запросов.
 *
 * @class Controls-ListEnv/searchConnected:Input
 * @implements Controls/interface:IContrastBackground
 * @implements Controls/input:IFieldTemplate
 * @implements Controls/input:IPadding
 * @implements Controls/input:IText
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IFontWeight
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IInputPlaceholder
 * @mixes Controls/interface:IStoreId
 * @remark
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/search/search-input/ руководство разработчика по настройке контрола}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/search/linking-search-string-to-list/ руководство разработчика по настройке поиска на странице}
 * @demo Controls-ListEnv-demo/Search/Input/Base/Index
 *
 * @public
 */
function SearchConnectedInput(props: ISearchInputOptions, ref) {
    const inputRef = React.useRef<HTMLDivElement>(null);
    const readOnly = useReadonly(props);

    React.useImperativeHandle(ref, () => {
        return inputRef.current;
    });

    const slice = useSearchConnectedFocus(inputRef, props.storeId);

    const onFocusOutHandler = React.useCallback(() => {
        if (slice) {
            slice.setState({
                searchInputFocused: false,
            });
        }
    }, [slice]);

    return (
        <InputSearchContextResolver
            onInputCompleted={props.onInputcompleted || props.onInputCompleted}
            onResetClick={props.onResetclick || props.onResetClick}
            customEvents={customEvents}
            storeId={props.storeId}
            attrs={props.attrs}
            className={props.className}
        >
            <InputContent
                ref={inputRef}
                contrastBackground={props.contrastBackground}
                leftFieldTemplate={props.leftFieldTemplate}
                rightFieldTemplate={props.rightFieldTemplate}
                horizontalPadding={props.horizontalPadding}
                convertPunycode={props.convertPunycode}
                transliterate={props.transliterate}
                trim={props.trim}
                inputCallback={props.inputCallback}
                maxLength={props.maxLength}
                fontColorStyle={props.fontColorStyle}
                fontSize={props.fontSize}
                fontWeight={props.fontWeight}
                inlineHeight={props.inlineHeight}
                placeholder={props.placeholder}
                placeholderVisibility={props.placeholderVisibility}
                searchButtonIconStyle={props.searchButtonIconStyle}
                searchButtonAlign={props.searchButtonAlign}
                searchButtonVisible={props.searchButtonVisible}
                className={props.className}
                readOnly={readOnly}
                onFocusOut={onFocusOutHandler}
                tooltip={props.tooltip}
            />
        </InputSearchContextResolver>
    );
}

export default React.forwardRef(SearchConnectedInput);

/**
 * @name Controls-ListEnv/searchConnected:Input#trim
 * @cfg
 * @default false
 */

/**
 * @name Controls-ListEnv/searchConnected:Input#tooltip
 * @cfg {String} Текст всплывающей подсказки, отображаемой при наведении указателя мыши на элемент.
 */

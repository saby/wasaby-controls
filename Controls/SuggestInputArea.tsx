import * as React from 'react';
import { ISuggestOptions } from 'Controls/SuggestInput';
import { _InputController } from 'Controls/suggest';
import { IAreaOptions, Area } from 'Controls/input';
import 'css!Controls/SuggestInput';
import { Model } from 'Types/entity';
import { useAdaptiveMode } from 'UICore/Adaptive';

/**
 * Интерфейс для многострочного поля ввода с автодополнением
 * @interface Controls/SuggestInputArea/ISuggestAreaOptions
 * @extends Controls/suggest:ISuggest
 * @extends Controls/interface:ISearch
 * @extends Controls/interface/IBorderStyle
 * @extends Controls/interface:ISource
 * @extends Controls/interface:IFilterChanged
 * @extends Controls/interface:INavigation
 * @extends Controls/interface:IFontColorStyle
 * @extends Controls/interface:IFontSize
 * @extends Controls/interface:IFontWeight
 * @extends Controls/interface:IValidationStatus
 * @extends Controls/interface:IContrastBackground
 * @extends Controls/interface:ISelectorDialog
 * @extends Controls/interface:IFilter
 * @extends Controls/input:ITag
 * @extends Controls/input:IBase
 * @extends Controls/interface:IInputPlaceholder
 * @extends Controls/input:IText
 * @extends Controls/input:IValue
 * @extends Controls/input:IMaxLengthOptions
 * @extends Controls/input:IAreaOptions
 * @public
 */
interface ISuggestAreaOptions extends IAreaOptions, ISuggestOptions {}

/**
 * Многострочное поле ввода с автодополнением, которое помогает пользователю ввести текст, предлагая подходящие варианты по первым набранным символам.
 * @remark
 * Полезные ссылки:
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_suggest.less переменные тем оформления}
 * * {@link Controls/SuggestInputArea:ISuggestAreaOptions интерфейс для создания прикладных оберток над многострочным полем ввода с автодополнением}
 * @class Controls/SuggestInputArea
 * @extends UI/Base:Control
 * @mixes Controls/suggest:ISuggest
 * @implements Controls/interface:ISearch
 * @implements Controls/interface/IBorderStyle
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IFontWeight
 * @implements Controls/interface:IValidationStatus
 * @implements Controls/interface:IContrastBackground
 * @implements Controls/interface:ISelectorDialog
 * @implements Controls/input:IAreaOptions
 * @mixes Controls/input:ITag
 * @mixes Controls/input:IBase
 * @implements Controls/interface:IInputPlaceholder
 * @mixes Controls/input:IText
 * @mixes Controls/input:IValue
 *
 * @public
 * @demo Controls-demo/Suggest_new/Input/Multiline/Index
 */
const SuggestInputArea = React.forwardRef((props: ISuggestAreaOptions, ref: any) => {
    const [suggestState, setSuggestState] = React.useState<boolean>(false);
    const [searchState, setSearchState] = React.useState<boolean>(false);
    const [suggestDirection, setSuggestDirection] = React.useState<null | string>(null);
    const [showInputBorderBySuggestPopupWidth, setShowInputBorderBySuggestPopupWidth] =
        React.useState<boolean>(false);

    const isAdaptive = useAdaptiveMode().device.isPhone();

    const inputRef = React.useRef(null);

    const tagHoverHandler = React.useCallback(
        (event: React.SyntheticEvent) => {
            if (props?.onTagHover) {
                props.onTagHover(event);
            }
        },
        [props.onTagHover]
    );

    const tagClickHandler = React.useCallback(
        (event: React.SyntheticEvent) => {
            if (props?.onTagClick) {
                props.onTagClick(event);
            }
        },
        [props.onTagClick]
    );

    const chooseHandler = React.useCallback(
        (item: Model) => {
            inputRef?.current?.activate({ enableScreenKeyboard: true });
            if (props?.onValueChanged) {
                props.onValueChanged('valueChanged', item.get(props.displayProperty || ''));
            }
        },
        [props.onValueChanged, props.displayProperty]
    );

    const deactivatedHandler = React.useCallback((): void => {
        setSuggestState(false);
    }, [setSuggestState]);

    const searchStartHandler = React.useCallback((): void => {
        setSearchState(true);
        setShowInputBorderBySuggestPopupWidth(isInputWiderThanSuggest());
    }, [setSearchState, setShowInputBorderBySuggestPopupWidth]);

    const searchEndHandler = React.useCallback((): void => {
        setSearchState(false);
    }, [setSearchState]);

    const searchErrorHandler = React.useCallback((): void => {
        setSearchState(false);
    }, [setSearchState]);

    const suggestDirectionChangedHandler = React.useCallback(
        (event: React.SyntheticEvent, direction: any): void => {
            setSuggestDirection(direction);
        },
        [setSuggestDirection]
    );

    const onSuggestStateChangedHandler = React.useCallback(
        (value: boolean) => {
            setSuggestState(value);
        },
        [setSuggestState]
    );

    const isInputWiderThanSuggest = React.useCallback((): boolean => {
        if (props.suggestPopupOptions?.width) {
            const suggestWidth =
                typeof props.suggestPopupOptions.width === 'string'
                    ? Number(props.suggestPopupOptions.width.replace(/\D/g, ''))
                    : props.suggestPopupOptions.width;
            return inputRef?.current._container.offsetWidth > suggestWidth;
        }
        return false;
    }, [props.suggestPopupOptions]);

    return (
        <_InputController
            ref={ref}
            className={props.className}
            onChoose={chooseHandler}
            onDeactivated={deactivatedHandler}
            searchStartCallback={searchStartHandler}
            searchEndCallback={searchEndHandler}
            searchErrorCallback={searchErrorHandler}
            suggestDirectionChanged={suggestDirectionChangedHandler}
            onSuggestStateChanged={onSuggestStateChangedHandler}
            suggestTemplate={props.suggestTemplate}
            footerTemplate={props.footerTemplate}
            minSearchLength={props.minSearchLength || 3}
            suggestListsOptions={props.suggestListsOptions}
            source={props.source}
            keyProperty={props.keyProperty}
            historyId={props.historyId}
            trim={props.trim}
            searchParam={props.searchParam}
            searchDelay={props.searchDelay}
            searchValueTrim={props.searchValueTrim}
            navigation={props.navigation}
            autoDropDown={props.autoDropDown}
            emptyTemplate={props.emptyTemplate}
            layerName="Controls/suggestPopup:__PopupLayer"
            filter={props.filter}
            sorting={props.sorting}
            value={props.value}
            dataLoadCallback={props.dataLoadCallback}
            selectorTemplate={props.selectorTemplate}
            suggestPopupOptions={props.suggestPopupOptions}
            closeButtonVisible={props.closeButtonVisible}
            parentProperty={props.parentProperty}
            nodeProperty={props.nodeProperty}
            displayProperty={props.displayProperty}
            selectionType={props.selectionType || 'leaf'}
            suggestState={suggestState}
        >
            <InputArea
                {...props}
                ref={inputRef}
                value={props.value}
                tagClickHandler={tagClickHandler}
                tagHoverHandler={tagHoverHandler}
                searchState={searchState}
                suggestInputAreaValueChanged={props.onValueChanged}
                suggestState={suggestState}
                suggestDirection={suggestDirection}
                isAdaptive={isAdaptive}
                showInputBorderBySuggestPopupWidth={showInputBorderBySuggestPopupWidth}
            />
        </_InputController>
    );
});

const InputArea = React.forwardRef((props, ref) => {
    const {
        tagClickHandler,
        tagHoverHandler,
        suggestState,
        suggestDirection,
        isAdaptive,
        showInputBorderBySuggestPopupWidth,
        borderVisibility,
        suggestInputAreaValueChanged,
        onValueChanged,
        maxLength,
        maxLines,
        minLines,
    } = props;

    const valueChangeHandler = React.useCallback(
        (event: React.SyntheticEvent, value: any) => {
            if (suggestInputAreaValueChanged) {
                suggestInputAreaValueChanged(event, value);
            }
            onValueChanged(event, value);
        },
        [props.onValueChanged, props.suggestInputAreaValueChanged]
    );

    return (
        <Area
            {...props}
            ref={ref}
            maxLength={maxLength}
            maxLines={maxLines}
            minLines={minLines}
            onValueChanged={valueChangeHandler}
            onTagClick={tagClickHandler}
            onTagHover={tagHoverHandler}
            borderVisibility={
                suggestState &&
                suggestDirection === 'down' &&
                !isAdaptive &&
                !showInputBorderBySuggestPopupWidth
                    ? 'hidden'
                    : borderVisibility || 'partial'
            }
        />
    );
});

/**
 * @name Controls/SuggestInputArea#closeButtonVisible
 * @cfg {Boolean} Флаг, отвечающий за отображение кнопки закрытия автодополнения.
 * @default true
 */

/**
 * @event showSelector Происходит перед открытием окна выбора, которое открывается при клике на "Показать всё".
 * @remark
 * Кнопка "Показать всё" отображается в подвале автодополнения.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 */

export { SuggestInputArea, ISuggestAreaOptions };

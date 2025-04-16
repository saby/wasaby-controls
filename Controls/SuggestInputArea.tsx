import * as React from 'react';
import { ISuggestOptions } from 'Controls/SuggestInput';
import { _InputController } from 'Controls/suggest';
import { IAreaOptions, Area, ICallback } from 'Controls/input';
import 'css!Controls/SuggestInput';
import { Model } from 'Types/entity';
import { useAdaptiveMode } from 'UICore/Adaptive';
import { ILoadDataConfig } from 'Controls/dataSourceOld';
import { LegacyRef, Ref, SyntheticEvent } from 'react';
import { IEmptyTemplateProp } from 'Controls/interface';
import { useReadonly } from 'UICore/Contexts';

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
interface ISuggestAreaOptions
    extends IAreaOptions,
        Omit<ISuggestOptions, 'footerTemplate' | 'onValueChanged'> {
    footerTemplate?: ISuggestOptions['footerTemplate'];
    suggestListsOptions: Record<string, ILoadDataConfig>;
}

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
const SuggestInputArea = React.forwardRef(
    (props: ISuggestAreaOptions, ref: LegacyRef<any> | undefined) => {
        const [suggestState, setSuggestState] = React.useState<boolean>(false);
        const [searchState, setSearchState] = React.useState<boolean>(false);
        const [suggestDirection, setSuggestDirection] = React.useState<null | string>(null);
        const [showInputBorderBySuggestPopupWidth, setShowInputBorderBySuggestPopupWidth] =
            React.useState<boolean>(false);

        const isAdaptive = useAdaptiveMode().device.isPhone();

        const inputRef = React.useRef<Area | null>(null);

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
            (item: Model, tabsSelectedKey: string | number | null) => {
                inputRef?.current?.activate({
                    enableScreenKeyboard: true,
                });
                if (props?.onChoose) {
                    props.onChoose('choose', [item, tabsSelectedKey]);
                }

                if (props?.onValueChanged) {
                    props.onValueChanged('valueChanged', item.get(props.displayProperty || ''));
                }
            },
            [props.onChoose, props.onValueChanged, props.displayProperty]
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
            (_event: React.SyntheticEvent, direction: string): void => {
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
                return (
                    (inputRef?.current?._container?.offsetWidth
                        ? inputRef?.current?._container?.offsetWidth
                        : 0) > suggestWidth
                );
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
                emptyTemplate={props.emptyTemplate as IEmptyTemplateProp | undefined}
                layerName="Controls/suggestPopup:__PopupLayer"
                filter={props.filter}
                sorting={props.sorting}
                value={props.value as string | null}
                dataLoadCallback={props.dataLoadCallback}
                selectorTemplate={props.selectorTemplate}
                suggestPopupOptions={props.suggestPopupOptions}
                closeButtonVisible={props.closeButtonVisible}
                parentProperty={props.parentProperty}
                nodeProperty={props.nodeProperty}
                displayProperty={props.displayProperty}
                selectionType={props.selectionType || 'leaf'}
                suggestState={suggestState}
                inputCallback={null as unknown as ICallback<string>}
                searchClick={null as unknown as Function}
            >
                <InputArea
                    {...props}
                    ref={inputRef as React.Ref<HTMLDivElement> | undefined}
                    value={props.value}
                    tagClickHandler={tagClickHandler}
                    tagHoverHandler={tagHoverHandler}
                    searchState={searchState}
                    suggestInputAreaValueChanged={props.onValueChanged}
                    suggestStateChanged={setSuggestState}
                    suggestState={suggestState}
                    autoDropDown={props.autoDropDown}
                    suggestDirection={suggestDirection}
                    isAdaptive={isAdaptive}
                    showInputBorderBySuggestPopupWidth={showInputBorderBySuggestPopupWidth}
                />
            </_InputController>
        );
    }
);

interface IInputAreaOptions extends ISuggestAreaOptions {
    tagClickHandler: (e: SyntheticEvent<Element, Event>) => void;
    tagHoverHandler: (e: SyntheticEvent<Element, Event>) => void;
    suggestState: boolean;
    suggestDirection: string | null;
    showInputBorderBySuggestPopupWidth: boolean;
    suggestInputAreaValueChanged: ((value: string, displayValue: string) => void) | undefined;
    suggestStateChanged: (value: boolean) => void;
    searchState: boolean;
    isAdaptive?: boolean;
}

const InputArea = React.forwardRef((props: IInputAreaOptions, _ref: Ref<HTMLDivElement>) => {
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
        suggestStateChanged,
        autoDropDown,
    } = props;

    const readOnly = useReadonly(props);

    const inputAreaRef = React.useRef<Area | null>(null);

    const valueChangeHandler = React.useCallback(
        (value: string, displayValue: string) => {
            if (suggestInputAreaValueChanged) {
                suggestInputAreaValueChanged(value, displayValue);
            }
            if (onValueChanged) {
                onValueChanged(value, displayValue);
            }
        },
        [onValueChanged, suggestInputAreaValueChanged]
    );

    const clearMousedown = React.useCallback(
        (event) => {
            event.stopPropagation();
        },
        [props]
    );

    const clearClick = React.useCallback(
        (_event: React.SyntheticEvent) => {
            /* move focus to input after clear text, because focus will be lost after hiding cross  */
            inputAreaRef?.current?.activate({ enableScreenKeyboard: true });
            suggestStateChanged(!!autoDropDown);
            if (suggestInputAreaValueChanged) {
                suggestInputAreaValueChanged('', '');
            }
        },
        [suggestStateChanged, suggestInputAreaValueChanged, autoDropDown]
    );

    return (
        <>
            <Area
                {...props}
                ref={inputAreaRef}
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
                className={`controls-SuggestInputArea ${props.className}`}
            />
            {props.value && !readOnly ? (
                <div
                    className="controls-SuggestInputArea__clear controls-SuggestV__clear controls-icon icon-CloseNew"
                    onClick={clearClick}
                    onMouseDown={clearMousedown}
                    title="Очистить"
                    ws-no-focus={'true'}
                    data-qa="SearchInputArea__resetButton"
                ></div>
            ) : null}
        </>
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

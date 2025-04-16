/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */

import { forwardRef, useRef, useImperativeHandle, ForwardedRef, useMemo } from 'react';
import { Input, ISearchIconOptions, ISearchInputOptions } from 'Controls/search';
import { InputSearchContextResolver } from 'Controls/search';
import { IControlOptions } from 'UI/Base';
import { useReadonly } from 'UI/Contexts';
import { useSearchConnectedFocusWithSlices } from './hooks/searchConnectedHooks';
import { useSliceActions } from 'Controls-DataEnv/context';
import {
    IFontColorStyleOptions,
    IFontSizeOptions,
    IFontWeightOptions,
    IHeightOptions,
    IInputPlaceholderOptions,
    IContrastBackgroundOptions,
} from 'Controls/interface';
import {
    IFieldTemplateOptions,
    IPaddingOptions,
    ITextOptions,
    IValueOptions,
    IRenderOptions,
} from 'Controls/input';
import type { ListSlice } from 'Controls/dataFactory';

export interface ISearchConnectedInputOptions
    extends IControlOptions,
        IFontColorStyleOptions,
        IFontSizeOptions,
        IFontWeightOptions,
        IHeightOptions,
        IInputPlaceholderOptions,
        ITextOptions,
        IPaddingOptions,
        IFieldTemplateOptions,
        ISearchIconOptions,
        IContrastBackgroundOptions,
        Partial<Pick<IValueOptions<unknown>, 'inputCallback'>>,
        Pick<IRenderOptions, 'onInputCompleted'> {
    tooltip?: string;
    storeId: string | string[];
    attrs?: Record<string, unknown>;
    onResetClick?: () => void;
}

const customEvents = ['onInputCompleted', 'onResetClick'];

const InputContent = forwardRef((props: ISearchInputOptions, ref) => {
    return <Input {...props} forwardedRef={ref} />;
});

interface ISearchConnectedInputOptionsSlicesCollector extends ISearchConnectedInputOptions {
    slices: Record<string, ListSlice | undefined>;
    storeIds: string[];
}

const SearchConnectedInputInner = forwardRef(
    (props: ISearchConnectedInputOptionsSlicesCollector, ref: ForwardedRef<unknown>) => {
        const inputRef = useRef<HTMLDivElement>(null);
        const readOnly = useReadonly(props);

        useImperativeHandle(ref, () => {
            return inputRef.current;
        });

        const slicesArr: readonly (ListSlice | undefined)[] = useMemo(
            () => Object.values(props.slices),
            [props.slices]
        );

        const onFocusOutHandler = useSearchConnectedFocusWithSlices(
            inputRef,
            props.storeId,
            slicesArr
        );

        return (
            <InputSearchContextResolver
                onInputCompleted={props.onInputCompleted}
                onResetClick={props.onResetClick}
                customEvents={customEvents}
                storeId={props.storeId}
                slices={props.slices}
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
                    constraint={props.constraint}
                />
            </InputSearchContextResolver>
        );
    }
);

const SearchConnectedSliceCollector = forwardRef(
    (
        { slices, storeIds, ...restProps }: ISearchConnectedInputOptionsSlicesCollector,
        ref: ForwardedRef<unknown>
    ) => {
        const [storeId, restStoreIds] = useMemo(() => {
            const [first, ...rest] = storeIds;
            return [first, rest];
        }, [storeIds]);
        const slice = useSliceActions<ListSlice>(storeId);
        const nextSlices = useMemo(
            () => ({
                ...slices,
                [storeId]: slice,
            }),
            [slice, slices, storeId]
        );
        const NextRenderComponent = getRenderComponent(restStoreIds);
        return (
            <NextRenderComponent
                {...restProps}
                slices={nextSlices}
                storeIds={restStoreIds}
                ref={ref}
            />
        );
    }
);

function getRenderComponent(storeIds: string[]) {
    return storeIds.length ? SearchConnectedSliceCollector : SearchConnectedInputInner;
}

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
 * Для удаления пробелов при поиске нужно задавать {@link /docs/js/Controls/dataFactory/IListState/options/searchValueTrim searchValueTrim} в конфигурации {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ списочной фабрики}
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/search/search-input/ руководство разработчика по настройке контрола}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/search/linking-search-string-to-list/ руководство разработчика по настройке поиска на странице}
 * @demo Controls-ListEnv-demo/Search/Input/Base/Index
 *
 * @public
 */
function SearchConnectedInput(props: ISearchConnectedInputOptions, ref: ForwardedRef<unknown>) {
    const storeIds = useMemo(() => {
        if (!props.storeId) {
            return [];
        }
        if (Array.isArray(props.storeId)) {
            return props.storeId;
        }
        return [props.storeId];
    }, [props.storeId]);
    const slices = useMemo(() => ({}), []);
    const RenderComponent = getRenderComponent(storeIds);
    return <RenderComponent {...props} slices={slices} storeIds={storeIds} ref={ref} />;
}

export default forwardRef(SearchConnectedInput);

/**
 * @name Controls-ListEnv/searchConnected:Input#trim
 * @cfg
 * @default false
 */

/**
 * @name Controls-ListEnv/searchConnected:Input#tooltip
 * @cfg {String} Текст всплывающей подсказки, отображаемой при наведении указателя мыши на элемент.
 */

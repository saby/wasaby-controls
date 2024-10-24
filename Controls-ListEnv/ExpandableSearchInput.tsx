/**
 * @kaizen_zone 0ad19bb5-20cc-4d4e-90b9-eb7a0aa12d81
 */
import * as React from 'react';
import { IContextOptionsValue } from 'Controls/context';
import { InputSearchContextResolver } from 'Controls/search';
import ExpandableSearch, { IExpandableSearchOptions } from 'Controls/ExpandableSearch';
import { useSlice } from 'Controls-DataEnv/context';
import { ListSlice } from 'Controls/dataFactory';
import { SyntheticEvent } from 'UICommon/Events';

export interface IExpandableSearchInputOptions extends IExpandableSearchOptions {
    storeId: string | string[];
    _dataOptionsValue: IContextOptionsValue;
}

function Content(props: IExpandableSearchOptions): JSX.Element {
    return <ExpandableSearch {...props} />;
}

/**
 * Виджет "Разворачиваемый поиск
 * @class Controls-ListEnv/ExpandableSearchInput
 * @extends Controls/ExpandableSearch
 * @mixes Controls/interface:IStoreId
 * @ignoreOptions expanded value
 * @demo Controls-ListEnv-demo/ExpandableSearchInput/Base/Index
 * @public
 */
function ExpandableSearchInput(
    props: IExpandableSearchInputOptions,
    forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
    const slice = useSlice<ListSlice>(props.storeId);

    const [expanded, setExpanded] = React.useState(!!slice?.state.searchValue);

    const expandedChangeHandler = React.useCallback(
        (value: boolean) => {
            setExpanded(value);
        },
        [expanded]
    );

    return (
        <InputSearchContextResolver
            storeId={props.storeId}
            attrs={props.attrs}
            className={props.className || props.attrs?.className}
            readOnly={props.readOnly}
            forwardedRef={forwardedRef}
        >
            <Content
                inlineWidth={props.inlineWidth}
                contrastBackground={props.contrastBackground}
                searchInputDirection={props.searchInputDirection}
                leftFieldTemplate={props.leftFieldTemplate}
                rightFieldTemplate={props.rightFieldTemplate}
                horizontalPadding={props.horizontalPadding}
                convertPunycode={props.convertPunycode}
                transliterate={props.transliterate}
                trim={props.trim}
                inputCallback={props.inputCallback}
                fontColorStyle={props.fontColorStyle}
                fontSize={props.fontSize}
                fontWeight={props.fontWeight}
                inlineHeight={props.inlineHeight}
                placeholder={props.placeholder}
                placeholderVisibility={props.placeholderVisibility}
                searchButtonIconStyle={props.searchButtonIconStyle}
                searchButtonAlign={props.searchButtonAlign}
                searchButtonVisible={props.searchButtonVisible}
                shadowVisible={props.shadowVisible}
                expanded={expanded}
                readOnly={props.readOnly}
                onExpandedChanged={expandedChangeHandler}
                customEvents={['onExpandedChanged']}
            />
        </InputSearchContextResolver>
    );
}

export default React.forwardRef(ExpandableSearchInput);

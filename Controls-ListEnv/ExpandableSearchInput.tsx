/**
 * @kaizen_zone 0ad19bb5-20cc-4d4e-90b9-eb7a0aa12d81
 */
import * as React from 'react';
import { IContextOptionsValue } from 'Controls/context';
import { InputContainer } from 'Controls/search';
import ExpandableSearch, { IExpandableSearchOptions } from 'Controls/ExpandableSearch';

export interface IExpandableSearchInputOptions extends IExpandableSearchOptions {
    storeId: string | string[];
    _dataOptionsValue: IContextOptionsValue;
}

function Content(props: IExpandableSearchOptions): JSX.Element {
    return <ExpandableSearch {...props} />;
}

/**
 * Виджет "Разворачиваемый поиск
 * @extends Controls/ExpandableSearch
 * @mixes Controls/interface:IStoreId
 * @ignoreOptions expanded value
 * @demo Controls-ListEnv-demo/ExpandableSearchInput/Base/Index
 * @public
 */
function ExpandableSearchInput(
    props: IExpandableSearchInputOptions,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    return (
        <InputContainer storeId={props.storeId} attrs={props.attrs} ref={ref}>
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
            />
        </InputContainer>
    );
}

export default React.forwardRef(ExpandableSearchInput);
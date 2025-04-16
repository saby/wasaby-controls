import Continue, { ISearchHintProps } from './Continue';
import * as rk from 'i18n!Controls-ListEnv';

export type TEmptyHintProps = Pick<
    ISearchHintProps,
    'filterNames' | 'filterValues' | 'storeId' | 'details' | 'message'
>;
export default function Empty(props: TEmptyHintProps) {
    return (
        <Continue
            {...props}
            message={rk(props.message ?? 'Нет результатов поиска')}
            continueSearchCaption=""
        />
    );
}

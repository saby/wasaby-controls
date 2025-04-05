import Slice from 'Controls/_selector/SelectFactory/Slice';
import { SELECT_SLICE_STORE_ID } from 'Controls/_selector/SelectFactory/Constants';
import { useStrictSlice } from 'Controls-DataEnv/context';

export default function useSelectSlice(): Slice {
    return useStrictSlice<Slice>(SELECT_SLICE_STORE_ID);
}

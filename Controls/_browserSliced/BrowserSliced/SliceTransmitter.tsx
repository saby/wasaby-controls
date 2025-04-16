import { ListSlice } from 'Controls/dataFactory';
import { IComponentProps } from 'Controls/interface';
import { IBrowserOptions } from 'Controls/browser';
import { useStrictSlice } from 'Controls-DataEnv/context';
import { ReactElement, forwardRef, useMemo, ForwardedRef, cloneElement } from 'react';

interface IListEnvCompatibleProps extends IComponentProps {
    listsOptions: IBrowserOptions['listsOptions'];
    children: ReactElement;
}

interface ISliceCollectorProps {
    storeIds: string[];
    children: ReactElement;
    slices?: Record<string, ListSlice>;
}

const STORE_IDS_DEFAULT = ['_browserSyntheticStoreId'];

const SliceCollector = forwardRef(
    (
        { slices, storeIds, ...restProps }: ISliceCollectorProps,
        ref: ForwardedRef<unknown>
    ): ReactElement => {
        const [storeId, restStoreIds] = useMemo(() => {
            const [first, ...rest] = storeIds;
            return [first, rest];
        }, [storeIds]);
        const slice = useStrictSlice<ListSlice>(storeId);
        const nextSlices = useMemo(
            () => ({
                ...slices,
                [storeId]: slice,
            }),
            [slice, slices, storeId]
        );
        if (!restStoreIds.length) {
            return cloneElement(restProps.children, {
                ...restProps,
                slices: nextSlices,
                ref,
            });
        } else {
            return (
                <SliceCollector
                    storeIds={restStoreIds}
                    slices={nextSlices}
                    {...restProps}
                    ref={ref}
                />
            );
        }
    }
);

export default function SliceTransmitter(props: IListEnvCompatibleProps): ReactElement {
    const { listsOptions } = props;
    const storeIds = useMemo(() => {
        return listsOptions ? listsOptions.map(({ id }) => id) : STORE_IDS_DEFAULT;
    }, [listsOptions]);
    return <SliceCollector {...props} storeIds={storeIds} />;
}

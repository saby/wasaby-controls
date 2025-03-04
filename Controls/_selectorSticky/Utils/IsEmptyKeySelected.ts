import { TKey } from 'Controls/interface';

export default function isEmptyKeySelected(emptyKeys: TKey[], selectedKeys?: TKey[]): boolean {
    return !!emptyKeys.find((emptyKey) => selectedKeys?.includes(emptyKey));
}

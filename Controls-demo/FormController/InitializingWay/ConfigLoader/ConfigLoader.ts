import { Memory } from 'Types/source';

export function getConfig({ key, source }: { key: string; source: Memory }): object {
    return {
        record: {
            type: 'custom',
            loadDataMethod: () => {
                return source.read(key);
            },
            dependentArea: ['workspace'],
        },
    };
}

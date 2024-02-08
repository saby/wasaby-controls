import { useMemo } from 'react';
import { Meta, ObjectMeta } from 'Meta/types';

export function useParentTypes(type: ObjectMeta<any> | undefined, root: string): Meta<any>[] {
    return useMemo(() => {
        const result: any[] = [type];
        for (const name of root.split('.').filter(Boolean)) {
            result.push(result[result.length - 1]?.getAttributes()?.[name]);
        }
        result.shift();
        return result.filter(Boolean);
    }, [type, root]);
}

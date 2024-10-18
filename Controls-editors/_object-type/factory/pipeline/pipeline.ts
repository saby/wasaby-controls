import { getAllEditors } from './getAllEditors';
import { loadEditors } from './loadEditors';
import { ObjectMeta } from 'Meta/types';

export interface IPipelineResult {
    loadedEditors: string[];
    defaultEditors?: Record<string, string>;
}

export interface IPipelineArguments {
    metaType: ObjectMeta<object>;
    defaultEditors?: Record<string, string>;
}

export async function pipeline(args: IPipelineArguments): Promise<IPipelineResult> {
    const editors = getAllEditors(args.metaType, args.defaultEditors);

    const loadedEditors = await loadEditors(editors);
    return {
        loadedEditors,
        defaultEditors: args.defaultEditors,
    };
}

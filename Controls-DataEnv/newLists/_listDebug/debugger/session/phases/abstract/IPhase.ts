export type TInferBefore<T> = T extends IPhaseMeta<infer T, unknown> ? T : never;
export type TInferAfter<T> = T extends IPhaseMeta<unknown, infer T> ? T : never;

export interface IPhase<TMeta extends IPhaseMeta<unknown, unknown> = IPhaseMeta<unknown, unknown>> {
    id: string;
    description: string;
    getMeta(): TMeta;
    isStarted(): boolean;
    start(meta: TInferBefore<TMeta>): void;
    end(meta: TInferAfter<TMeta>): void;
    destroy(): void;
}

export interface IPhaseMeta<TBeforeMetaPart = unknown, TAfterMetaPart = unknown> {
    id: string;
    duration?: number;
    beforeMeta?: TBeforeMetaPart;
    afterMeta?: TAfterMetaPart;
}

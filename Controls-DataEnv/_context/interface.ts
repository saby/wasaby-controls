export type TContextElementKey = string;
export type TContextNodeKey = string;
export type TSliceKey = string;

export type IContextElementChange = Record<TSliceKey, unknown>;

export type IContextNodeChange = Record<TContextElementKey, IContextElementChange>;

export type IStoreChange = Record<TContextNodeKey, IContextNodeChange>;

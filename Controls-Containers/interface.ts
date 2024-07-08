import { ReactElement, ReactNode } from 'react';
import { IControlProps } from 'Controls/interface';
import { IWidgetProps } from 'Frame/interfaces';

export interface IItem {
    id: number;
    text: string;
    title: string;
}

export interface IItemsOptions {
    variants: {
        items: IItem[];
        selectedKeys: number[];
    };
}

export interface ITabsProps extends IControlProps, IItemsOptions {
    children: ReactNode | ReactNode[];
}

export interface ITabProps extends IWidgetProps {
    children: ReactNode[];
}

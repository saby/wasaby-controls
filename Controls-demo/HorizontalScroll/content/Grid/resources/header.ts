import * as TitleTemplate from 'wml!Controls-demo/HorizontalScroll/content/Grid/resources/header/titleTemplate';
import { TemplateFunction } from 'UI/Base';

export type TActionClickCallbackType = 'controls';
export type TActionClickCallback = (
    type: TActionClickCallbackType,
    column: IReturnColumn,
    index: number
) => void;

export interface IReturnColumn {
    caption: string;
    index: number;
    template?: TemplateFunction;
    templateOptions: {
        callback: TActionClickCallback;
    };
}

export const getHeader = (
    count: number,
    actionClickCallback?: TActionClickCallback
): IReturnColumn[] => {
    const result: IReturnColumn[] = [];
    result.push({
        caption: 'Название',
        template: TitleTemplate,
        templateOptions: {
            callback:
                actionClickCallback ||
                (() => {
                    return null;
                }),
        },
        index: 0,
    });
    for (let i = 0; i < count - 1; i++) {
        result.push({
            caption: `Колонка ${i}`,
            templateOptions: {
                callback:
                    actionClickCallback ||
                    (() => {
                        return null;
                    }),
            },
            index: i + 1,
        });
    }
    return result;
};

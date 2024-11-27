import { IColumn, IHeaderCell } from 'Controls/grid';

import * as fontSizeMTemplate from 'wml!Controls-demo/gridNew/Results/FontSize/cellTemplates/fontSizeM';
import * as fontSizeLTemplate from 'wml!Controls-demo/gridNew/Results/FontSize/cellTemplates/fontSizeL';
import * as fontSizeXLTemplate from 'wml!Controls-demo/gridNew/Results/FontSize/cellTemplates/fontSizeXL';
import * as fontSize2XLTemplate from 'wml!Controls-demo/gridNew/Results/FontSize/cellTemplates/fontSize2XL';
import * as fontSize3XLTemplate from 'wml!Controls-demo/gridNew/Results/FontSize/cellTemplates/fontSize3XL';
import * as fontSize4XLTemplate from 'wml!Controls-demo/gridNew/Results/FontSize/cellTemplates/fontSize4XL';
import * as fontSize5XLTemplate from 'wml!Controls-demo/gridNew/Results/FontSize/cellTemplates/fontSize5XL';

export const Data = {
    getColumns(): IColumn[] {
        return [
            {
                displayProperty: 'M',
                resultTemplate: fontSizeMTemplate,
                width: '100px',
            },
            {
                displayProperty: 'L',
                resultTemplate: fontSizeLTemplate,
                width: '100px',
            },
            {
                displayProperty: 'XL',
                resultTemplate: fontSizeXLTemplate,
                width: '100px',
            },
            {
                displayProperty: '$2XL',
                resultTemplate: fontSize2XLTemplate,
                width: '100px',
            },
            {
                displayProperty: '$3XL',
                resultTemplate: fontSize3XLTemplate,
                width: '100px',
            },
            {
                displayProperty: '$4XL',
                resultTemplate: fontSize4XLTemplate,
                width: '100px',
            },
            {
                displayProperty: '$5XL',
                resultTemplate: fontSize5XLTemplate,
                width: '100px',
            },
        ];
    },
    getData(): any {
        return [
            {
                key: 0,
                M: '10.1',
                L: '10.1',
                XL: '10.1',
                $2XL: '10.0',
                $3XL: '10',
                $4XL: '10.1',
                $5XL: '100000',
            },
            {
                key: 1,
                M: '20.5',
                L: '20',
                XL: '20.5',
                $2XL: '20.5',
                $3XL: '20',
                $4XL: '20',
                $5XL: '200000',
            },
        ];
    },
    getHeader(): IHeaderCell[] {
        return [
            {
                caption: 'm (default)',
            },
            {
                caption: 'l',
            },
            {
                caption: 'xl',
            },
            {
                caption: '2xl',
            },
            {
                caption: '3xl',
            },
            {
                caption: '4xl',
            },
            {
                caption: '5xl',
            },
        ];
    },
};

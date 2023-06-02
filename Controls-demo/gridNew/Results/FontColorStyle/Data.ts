import { IColumn, IHeaderCell } from 'Controls/grid';

/* eslint-disable max-len */

import * as fontColorSuccess from 'wml!Controls-demo/gridNew/Results/FontColorStyle/cellTemplate/fontColorSuccess';
import * as fontColorLink from 'wml!Controls-demo/gridNew/Results/FontColorStyle/cellTemplate/fontColorLink';
import * as fontColorPrimary from 'wml!Controls-demo/gridNew/Results/FontColorStyle/cellTemplate/fontColorPrimary';
import * as fontColorSecondary from 'wml!Controls-demo/gridNew/Results/FontColorStyle/cellTemplate/fontColorSecondary';
import * as fontColorReadonly from 'wml!Controls-demo/gridNew/Results/FontColorStyle/cellTemplate/fontColorReadonly';
import * as fontColorUnaccented from 'wml!Controls-demo/gridNew/Results/FontColorStyle/cellTemplate/fontColorUnaccented';
import * as fontColorWarning from 'wml!Controls-demo/gridNew/Results/FontColorStyle/cellTemplate/fontColorWarning';
import * as fontColorDanger from 'wml!Controls-demo/gridNew/Results/FontColorStyle/cellTemplate/fontColorDanger';

export const Data = {
    getColumns(): IColumn[] {
        return [
            {
                displayProperty: 'success',
                resultTemplate: fontColorSuccess,
                width: '80px',
            },
            {
                displayProperty: 'link',
                resultTemplate: fontColorLink,
                width: '80px',
            },
            {
                displayProperty: 'primary',
                resultTemplate: fontColorPrimary,
                width: '80px',
            },
            {
                displayProperty: 'secondary',
                resultTemplate: fontColorSecondary,
                width: '80px',
            },
            {
                displayProperty: 'readonly',
                resultTemplate: fontColorReadonly,
                width: '80px',
            },
            {
                displayProperty: 'unaccented',
                resultTemplate: fontColorUnaccented,
                width: '80px',
            },
            {
                displayProperty: 'warning',
                resultTemplate: fontColorWarning,
                width: '80px',
            },
            {
                displayProperty: 'danger',
                resultTemplate: fontColorDanger,
                width: '80px',
            },
        ];
    },
    getData(): any {
        return [
            {
                key: 0,
                success: '10.1',
                link: '10.1',
                primary: '10.1',
                secondary: '10.0',
                readonly: '10',
                unaccented: '10.1',
                warning: '100000',
                danger: '1000000',
            },
            {
                key: 1,
                success: '20.5',
                link: '20',
                primary: '20.5',
                secondary: '20.5',
                readonly: '20',
                unaccented: '20',
                warning: '200000',
                danger: '2000000',
            },
        ];
    },
    getHeader(): IHeaderCell[] {
        return [
            {
                caption: 'success',
            },
            {
                caption: 'link',
            },
            {
                caption: 'primary',
            },
            {
                caption: 'secondary (default)',
            },
            {
                caption: 'readonly',
            },
            {
                caption: 'unaccented',
            },
            {
                caption: 'warning',
            },
            {
                caption: 'danger',
            },
        ];
    },
};

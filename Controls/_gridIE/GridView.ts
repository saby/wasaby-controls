/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import type {GridView as BaseGridView, IGridOptions} from 'Controls/grid';
import {TemplateFunction} from 'UI/Base';
import * as TableTemplate from 'wml!Controls/_gridIE/GridView/GridView';
import 'css!Controls/gridIE';

/**
 * Представление таблицы, которое не поддерживает css grid
 * @private
 */

export default function GridView(base: typeof BaseGridView) {
    return class GridViewTable extends base {
        protected _template: TemplateFunction = TableTemplate;

        _getGridViewWrapperClasses(options: IGridOptions): string {
            const classes = super._getGridViewWrapperClasses.apply(this, arguments);
            return `${classes} controls-Grid__Wrapper_table-layout`;
        }

        _getGridViewClasses(options: IGridOptions): string {
            const classes = super._getGridViewClasses.apply(this, arguments);

            // При горизонтальном скролле ЕДИНСТВЕННО ВЕРНОЕ значение свойства table-layout - это auto.
            // Такая настройка позволяет колонкам тянуться, тогда как fixed жестко ограничивает их ширины.
            const isFixedLayout = !!options.columnScroll !== true;
            return `${classes} controls-Grid_table-layout controls-Grid_table-layout_${
                isFixedLayout ? 'fixed' : 'auto'
            }`;
        }

        _getGridViewStyles(): string {
            return '';
        }

        onViewResized(): void {
            super.onViewResized.apply(this, arguments);

            // Обновление авто-высоты контента, в IE иначе не работает.
            this._fixIETableCellAutoHeightBug();
        }

        _fixIETableCellAutoHeightBug(): void {
            if (typeof window === 'undefined') {
                return;
            }

            const setStyles = (styles: string): void => {
                // Контрол может быть разрушен к моменту следующего animationFrame,
                // используем именно такую проверку, т.к. запоминание таймера и очистка
                // его гораздо медленнее и вызовет дополнительные скачки.
                if (!this._destroyed && 'redrawWrapperStyles' in this._children) {
                    this._children.redrawWrapperStyles.innerHTML = styles;
                }
            };

            // Данная конструкция "пересчелкивает" высоту блока, довольно безопасно, без скачков.
            // В IE td поддерживает position: relative лишь частично, который так нужен для
            // позиционирования абсолютных частей элементов(actions, marker).
            // Не поддерживается автовысота, она считается только когда действительно поменялась высота стилями.
            window.requestAnimationFrame(() => {
                setStyles(
                    '.controls-Grid_table-layout .controls-Grid__row-cell__content { flex-basis: 100% }',
                );
                window.requestAnimationFrame(() => {
                    setStyles('');
                });
            });
        }
    };
}

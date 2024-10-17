/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import TreeGridView, { ITreeGridOptions } from './TreeGridView';
import { TemplateFunction } from 'UI/Base';
import { loadSync } from 'WasabyLoader/ModulesLoader';

/**
 * Представление иерархической таблицы, которое не поддерживает css grid
 * @private
 */
export default class TreeGridViewTable extends TreeGridView {
    protected _template: TemplateFunction =
        loadSync<typeof import('Controls/gridIE')>('Controls/gridIE').GridViewTemplate;

    protected _getGridViewWrapperClasses(options: ITreeGridOptions): string {
        return `${super._getGridViewWrapperClasses(options)} controls-Grid__Wrapper_table-layout`;
    }

    protected _getGridViewClasses(options: ITreeGridOptions): string {
        const classes = super._getGridViewClasses(options);

        // При горизонтальном скролле ЕДИНСТВЕННО ВЕРНОЕ значение свойства table-layout - это auto.
        // Такая настройка позволяет колонкам тянуться, тогда как fixed жестко ограничивает их ширины.
        const isFixedLayout = !!options.columnScroll !== true;
        return `${classes} controls-Grid_table-layout controls-Grid_table-layout_${
            isFixedLayout ? 'fixed' : 'auto'
        }`;
    }

    protected _getGridViewStyles(): string {
        return '';
    }

    onViewResized(): void {
        super.onViewResized();

        // Обновление авто-высоты контента, в IE иначе не работает.
        this._fixIETableCellAutoHeightBug();
    }

    private _fixIETableCellAutoHeightBug(): void {
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
                '.controls-Grid_table-layout .controls-Grid__row-cell__content { flex-basis: 100% }'
            );
            window.requestAnimationFrame(() => {
                setStyles('');
            });
        });
    }
}

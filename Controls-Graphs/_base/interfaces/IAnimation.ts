/**
 * @public
 * Интерфейс, определяющий будут ли анимироваться "переходы" графика.
 * @interface Controls-Graphs/_base/interfaces/IAnimation
 */
export default interface IAnimation {
    /**
     * @name Controls-Graphs/_base/interfaces/IAnimation#animation
     * @cfg {Boolean} Определяет наличие анимации
     * @default true
     */
    animation?: boolean;
}

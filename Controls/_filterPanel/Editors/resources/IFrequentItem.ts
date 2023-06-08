export interface IFrequentItemOptions {
    /**
     * @cfg {string} Ключ элемента для быстрого выбора, который отображается через разделитель в блоке "Можно отобрать"
     * @see frequentItemText
     */
    frequentItemKey?: string;

    /**
     * @cfg {string} Текст элемента для быстрого выбора, который отображается через разделитель в блоке "Можно отобрать"
     * @see frequentItemKey
     */
    frequentItemText?: string;
}

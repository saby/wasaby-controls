interface IControlConfig {
    /**
     * @cfg {String} Тип контрола, например, 'button' или 'list'.
     */
    type: string;

    /**
     * @cfg {String} Корневой css-класс контрола.
     */
    root: string;

    /**
     * @cfg {Boolean} Необходимость использования текста внутри контрола для привязки подсказки.
     */
    bindText?: boolean;

    /**
     * @cfg {Boolean} Необходимость использования контента внутри контрола для привязки подсказки.
     */
    bindContent?: boolean;
}

type TControlsConfig = IControlConfig[];

export { TControlsConfig };

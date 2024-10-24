interface IOffset {
    xOffset?: number;
    yOffset?: number;
}

/**
 * Класс для работы с DragNDrop.
 * @author Зайцев А.С.
 */
export default class DragNDrop {
    /**
     * Наводит мышь на элемент и тянет на 5 пикселей вправо
     * @param element Элемент, который нужно тянуть.
     */
    static async drag(element: WebdriverIO.Element): Promise<void> {
        await moveTo(element);
        const { x, y } = await browser.getElementRect(element.elementId);
        // TODO: после обновления wdio можно перейти на element.click со skipRelease: true
        await browser.performActions([
            {
                type: 'pointer',
                id: 'pointer1',
                parameters: { pointerType: 'mouse' },
                actions: [{ type: 'pointerDown', button: 0 }],
            },
        ]);
        await moveByOffset({
            xOffset: x,
            yOffset: y + 5,
        });
    }

    /**
     * Передвигает мышь к целевому элементу.
     * @param target Элемент, к которому нужно передвинуть мышь.
     */
    static async moveTo(target: WebdriverIO.Element): Promise<void> {
        await moveTo(target);
        const { x, y } = await browser.getElementRect(target.elementId);
        await moveByOffset({
            xOffset: x + 1,
            yOffset: y,
        });
    }

    /**
     * Передвигает мышь к целевому элементу и сдвигает курсор на указанное количество пикселей относительно левого верхнего угла цели.
     * @param target Элемент, к которому нужно передвинуть мышь.
     * @param xOffset Отступ по оси x от левого верхнего угла.
     * @param yOffset Отступ по оси y от левого верхнего угла.
     */
    static async moveToElementBy(
        target: WebdriverIO.Element,
        { xOffset = 0, yOffset = 0 }: IOffset
    ): Promise<void> {
        await moveTo(target);
        const { x, y } = await browser.getElementRect(target.elementId);
        await moveByOffset({
            xOffset: xOffset + x + 10,
            yOffset: yOffset + y,
        });
    }

    /**
     * Отпускает элемент (отжимает левую кнопку мыши).
     */
    static async drop(): Promise<void> {
        await browser.performActions([
            {
                type: 'pointer',
                id: 'pointer1',
                parameters: { pointerType: 'mouse' },
                actions: [{ type: 'pointerUp', button: 0 }],
            },
        ]);
    }
}

async function moveTo(target: WebdriverIO.Element): Promise<void> {
    const { x, y, width, height } = await browser.getElementRect(target.elementId);
    await moveByOffset({
        xOffset: Math.floor(x + width / 2),
        yOffset: Math.floor(y + height / 2),
    });
}

async function moveByOffset({ xOffset = 0, yOffset = 0 }: IOffset): Promise<void> {
    await browser.performActions([
        {
            type: 'pointer',
            id: 'pointer1',
            parameters: { pointerType: 'mouse' },
            actions: [{ type: 'pointerMove', duration: 0, x: xOffset, y: yOffset }],
        },
    ]);
}

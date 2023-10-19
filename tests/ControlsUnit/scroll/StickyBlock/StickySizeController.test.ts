import StickySizeController from 'Controls/_stickyBlock/Controllers/StickySizeController';

describe('Controls/_stickyBlock/Controllers/StickySizeController', () => {
    it('стики блок - скроллбар, обсвервится контент', () => {
        const stickySizeController = new StickySizeController(undefined, undefined);
        const stickyContainer = {
            getAttribute: () => {
                return 'column-scrollbar';
            },
            querySelector: () => {
                return {
                    setAttribute: () => {
                        return 0;
                    },
                };
            },
        };
        const resultContainer = stickySizeController.observe(stickyContainer);
        expect(resultContainer.toString()).toEqual(stickyContainer.querySelector().toString());
    });

    it('стики блок - НЕ скроллбар, обсвервится корневая нода', () => {
        const stickySizeController = new StickySizeController(undefined, undefined);
        const stickyContainer = {
            getAttribute: () => {
                return '';
            },
            querySelector: () => {
                return 'content node';
            },
            setAttribute: () => {
                return 0;
            },
        };
        const resultContainer = stickySizeController.observe(stickyContainer);
        expect(resultContainer).toBe(stickyContainer);
    });

    // Передаем элемент у которого контент: 1) с position: static; 2) position: absolute
    // Проверяем: если absolute - то обсервится контент, если static - обсервится корневая нода
    it('стики блок - скроллбар, анобсвервится контент', () => {
        const stickySizeController = new StickySizeController(undefined, undefined);
        const stickyContainer = {
            getAttribute: () => {
                return 'column-scrollbar';
            },
            querySelector: () => {
                return 'content node';
            },
        };
        const resultContainer = stickySizeController.unobserve(stickyContainer);
        expect(resultContainer).toBe('content node');
    });

    it('стики блок - НЕ скроллбар, анобсвервится корневая нода', () => {
        const stickySizeController = new StickySizeController(undefined, undefined);
        const stickyContainer = {
            getAttribute: () => {
                return '';
            },
            querySelector: () => {
                return 'content node';
            },
        };
        const resultContainer = stickySizeController.unobserve(stickyContainer);
        expect(resultContainer).toBe(stickyContainer);
    });

    // Передаем элемент с новыми размерами, которого нет в коллекции
    // Проверяем, что он добавлен
    // Обновили ему размеры - проверили, что всё ок
    it('Добавление и последующее обновление размеров', () => {
        const stickySizeController = new StickySizeController(undefined, undefined);
        let result = stickySizeController.updateBlockSize('1', 50, 50);
        expect(result).toBeFalsy();
        result = stickySizeController.updateBlockSize('1', 60, 50);
        expect(result).toBeTruthy();
    });
});

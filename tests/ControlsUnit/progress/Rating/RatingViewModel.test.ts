import RatingViewModel from 'Controls/_progress/Rating/RatingViewModel';

describe('Controls/progress:Rating', () => {
    it('ViewModel constructor', () => {
        let vm: RatingViewModel;

        vm = new RatingViewModel({
            value: 3,
            precision: 0,
            iconColorMode: 'dynamic',
            emptyIconFill: 'none',
        });
        expect([
            {
                index: 1,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate6',
            },
            {
                index: 2,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate6',
            },
            {
                index: 3,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate6',
            },
            {
                index: 4,
                type: 'empty',
                icon: 'icon-Unfavorite',
                iconStyle: 'readonly',
            },
            {
                index: 5,
                type: 'empty',
                icon: 'icon-Unfavorite',
                iconStyle: 'readonly',
            },
        ]).toEqual(vm.getItems());

        vm = new RatingViewModel({
            value: 1,
            precision: 0,
            iconColorMode: 'dynamic',
            emptyIconFill: 'none',
        });
        expect([
            {
                index: 1,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate2',
            },
            {
                index: 2,
                type: 'empty',
                icon: 'icon-Unfavorite',
                iconStyle: 'readonly',
            },
            {
                index: 3,
                type: 'empty',
                icon: 'icon-Unfavorite',
                iconStyle: 'readonly',
            },
            {
                index: 4,
                type: 'empty',
                icon: 'icon-Unfavorite',
                iconStyle: 'readonly',
            },
            {
                index: 5,
                type: 'empty',
                icon: 'icon-Unfavorite',
                iconStyle: 'readonly',
            },
        ]).toEqual(vm.getItems());

        vm = new RatingViewModel({
            value: 5,
            precision: 0,
            iconColorMode: 'dynamic',
            emptyIconFill: 'none',
        });
        expect([
            {
                index: 1,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate10',
            },
            {
                index: 2,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate10',
            },
            {
                index: 3,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate10',
            },
            {
                index: 4,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate10',
            },
            {
                index: 5,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate10',
            },
        ]).toEqual(vm.getItems());

        vm = new RatingViewModel({
            value: 3,
            precision: 0.5,
            iconColorMode: 'static',
            emptyIconFill: 'none',
        });
        expect([
            {
                index: 1,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 2,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 3,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 4,
                type: 'empty',
                icon: 'icon-Unfavorite',
                iconStyle: 'readonly',
            },
            {
                index: 5,
                type: 'empty',
                icon: 'icon-Unfavorite',
                iconStyle: 'readonly',
            },
        ]).toEqual(vm.getItems());

        vm = new RatingViewModel({
            value: 3.2,
            precision: 0,
            iconColorMode: 'static',
            emptyIconFill: 'none',
        });
        expect([
            {
                index: 1,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 2,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 3,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 4,
                type: 'empty',
                icon: 'icon-Unfavorite',
                iconStyle: 'readonly',
            },
            {
                index: 5,
                type: 'empty',
                icon: 'icon-Unfavorite',
                iconStyle: 'readonly',
            },
        ]).toEqual(vm.getItems());

        vm = new RatingViewModel({
            value: 3.2,
            precision: 0.5,
            iconColorMode: 'static',
            emptyIconFill: 'none',
        });
        expect([
            {
                index: 1,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 2,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 3,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 4,
                type: 'empty',
                icon: 'icon-Unfavorite',
                iconStyle: 'readonly',
            },
            {
                index: 5,
                type: 'empty',
                icon: 'icon-Unfavorite',
                iconStyle: 'readonly',
            },
        ]).toEqual(vm.getItems());

        vm = new RatingViewModel({
            value: 3.6,
            precision: 0.5,
            iconColorMode: 'static',
            emptyIconFill: 'none',
        });
        expect([
            {
                index: 1,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 2,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 3,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 4,
                type: 'half',
                icon: 'icon-FavoriteHalf',
                iconStyle: 'rate',
            },
            {
                index: 5,
                type: 'empty',
                icon: 'icon-Unfavorite',
                iconStyle: 'readonly',
            },
        ]).toEqual(vm.getItems());

        vm = new RatingViewModel({
            value: 3,
            precision: 0,
            iconColorMode: 'static',
            emptyIconFill: 'full',
        });
        expect([
            {
                index: 1,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 2,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 3,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 4,
                type: 'empty',
                icon: 'icon-Favorite',
                iconStyle: 'readonly',
            },
            {
                index: 5,
                type: 'empty',
                icon: 'icon-Favorite',
                iconStyle: 'readonly',
            },
        ]).toEqual(vm.getItems());
    });

    it('ViewModel setValue', () => {
        const vm = new RatingViewModel({
            value: 3.6,
            precision: 0.5,
            iconColorMode: 'dynamic',
            emptyIconFill: 'none',
        });

        vm.setValue(4);

        expect([
            {
                index: 1,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate8',
            },
            {
                index: 2,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate8',
            },
            {
                index: 3,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate8',
            },
            {
                index: 4,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate8',
            },
            {
                index: 5,
                type: 'empty',
                icon: 'icon-Unfavorite',
                iconStyle: 'readonly',
            },
        ]).toEqual(vm.getItems());
    });

    it('ViewModel setOptions', () => {
        const vm = new RatingViewModel({
            value: 3.6,
            precision: 0.5,
            iconColorMode: 'static',
            emptyIconFill: 'none',
        });

        vm.setOptions({
            value: 2.8,
            precision: 0,
            iconColorMode: 'dynamic',
            emptyIconFill: 'full',
            maxValue: 5,
            viewMode: 'stars',
        });

        expect([
            {
                index: 1,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate4',
            },
            {
                index: 2,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate4',
            },
            {
                index: 3,
                type: 'empty',
                icon: 'icon-Favorite',
                iconStyle: 'readonly',
            },
            {
                index: 4,
                type: 'empty',
                icon: 'icon-Favorite',
                iconStyle: 'readonly',
            },
            {
                index: 5,
                type: 'empty',
                icon: 'icon-Favorite',
                iconStyle: 'readonly',
            },
        ]).toEqual(vm.getItems());
    });
    it('ViewModel maxValue = 3', () => {
        const vm = new RatingViewModel({
            value: 3,
            precision: 0,
            iconColorMode: 'static',
            emptyIconFill: 'none',
            maxValue: 3,
        });
        expect([
            {
                index: 1,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 2,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
            {
                index: 3,
                type: 'full',
                icon: 'icon-Favorite',
                iconStyle: 'rate',
            },
        ]).toEqual(vm.getItems());
    });
    it('ViewModel viewMode = hearts', () => {
        const vm = new RatingViewModel({
            value: 5,
            precision: 0,
            iconColorMode: 'static',
            emptyIconFill: 'none',
            viewMode: 'hearts',
        });
        expect([
            {
                index: 1,
                type: 'full',
                icon: 'icon-Love',
                iconStyle: 'rate',
            },
            {
                index: 2,
                type: 'full',
                icon: 'icon-Love',
                iconStyle: 'rate',
            },
            {
                index: 3,
                type: 'full',
                icon: 'icon-Love',
                iconStyle: 'rate',
            },
            {
                index: 4,
                type: 'full',
                icon: 'icon-Love',
                iconStyle: 'rate',
            },
            {
                index: 5,
                type: 'full',
                icon: 'icon-Love',
                iconStyle: 'rate',
            },
        ]).toEqual(vm.getItems());
    });
});

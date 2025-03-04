const IMAGES = {
    money: 'data:image/webp;base64,UklGRmIFAABXRUJQVlA4IFYFAADQFwCdASo4ADgAPok0k0elIqGhMfxtsKARCWgAqS1BVP495leOHnT4v89xntulz5Xog/2++x7zn/u6A7zv/A5Hlwv2GRbcpvilLN2DmWuJTSazQPG/9Z+wL+tvWi/cb2Vf2kPJhZXCCQ39Kv3dPD6joi5y74W0SO+b+9+KFHIt+N9C2+5sJ7ss1dsQZt6AD5pGJlRgR4y5shyK3nGGgO167U1rmIvORn5eO7oyPx5lrJiJ8hmGiPmbFNPOTfAlrAPB5p5xaRwAAP74E3pAkTePeY2Edr1BbxTUnkU615A39EshaAPCcjRAfKeqgiCNuZ4IcOwYr3D/Z+gU5RoZGPgQwZMauXvBhVLE3ZjIomdGCkqYYyj5Xs2WbPQk275ci8wizBZ7297Meb+Zbd9qlOrQsUbBfIThdZiwHNyw7tqHAQT3woWpqByF9lGSF+1xJbLy9EZQ/c5Y3W+BmOXJ4jAUqbSBCpLaIL7U1dkSGESlqFjvAj6i+iUloZSzSRQsEPJaiWz+AsUkoDaAPGABGwB/pQHPbOd0wQStNgP2fjl4itzPIt3vWeZ581EQ5708JLfRn6lWxfmWlUTeM+ubnhXfOVlAU6WqzIJZ5g8yhF71UcAPyR25irTjbUtCIttQyLv1KBGVoqUuO9OLFi2W9cQWcaM7gv983xURR7L9lyFgN9NVNv1RfRivVXjmyB1bf9ECYpk5sY2OHeYg3XUNfhK1TtUHlDIjb5fACMm8pOCSl32sgQDK1ZeZHGkA5aw2GTkqEd4yNbh4mT4ty9+5vlFIfoH9YdT6ZQ/YxNiQaZBchePkE/8ppUNlz2Qh5f+v+hdp2lf9cvgmQ4hrd0Wi7Nmuebo1nJrUsRO9AStJGYE3laApO4NR3RSdJm3xiV1YtFMLtTVB9p4oAWEWm4LuJqg/LVgvl/4OO9Ej2XCMNDupSWdmipYBbSeoJIGL6YU3R715/wU4G3/lFW51wSth4X3/U7vInmZw07QGCjuQZjCruria0GizE/tJnEkgsx+b0NpnEyqQFsU94ZOwqY5x/EzXbBkWdNfT562EghtmivQkn47Lw1ygvcW6789Y5zZSQkNLAaSzSphsmMFfOaAYZJHJnPx8iq7YIvEpgK8dGRNXaFBNrmnw6uHRs4HiTDqqRAG3OXvtqvrqDulfQEGVz6FHes1T2mzavDB8sWGoCqc1ypDXDiRSI0oC8cfS4iC5ERA5gxuq1Z1lAuyIVn+I3MHKZqzuO07rKRnccFRhiVOu4AXEq5C4aMTQ7knIlLeEg0XK89qZy0InfOYsCiACaXSGpIitqYl/gV71qgVKGP7+BQEdTZ/ejOvKPgKfsIu+BK60hArqFAZDA7E6mjhoEXEj/ATRloxnEMaqC61Av7DNvMR8w5jGJvX3qOf8IsUqUU/1ZlDv3V3fDr/tP9r6qZrU1vD330qnXZqIAjGhaqkcVJqbtyndXd39B9dyqHC9mYaaxbWu1BrkEDOdCxFpMui/yUmmleqvb6Fic0bUtfZZbUiIy1LIAiN0XgyArsCV7heJRoiDGu+DHVZpRFAU6TP5J1RFI93J0Dv2bBknQmRa4OOo54Ijdt5XDZzgOL4oxQ0cf1foymr4tomkCW6c8fnTwit3/YVjqphJ9qLFrePPphHx/7jSekfkwQYFrJvCJmC8w8k0tMkxbam0qeOfolgWJnxUPrvnn6aVZBHxZ6clBl555HbMWykksScgITbuJzf7wLoJw68uIzICJn0y3mP31uXb96bEUIxRIVrBRZrXlzJbLVUr4WZdgAEIA17TrvqyFBeNi5r+e+rvKhUpZNr0WriPmAAA',
    app: 'data:image/webp;base64,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',
    monkey: 'data:image/webp;base64,UklGRo4EAABXRUJQVlA4IIIEAAAQFACdASo4ADgAPpE2lUgloqIhMBgM+LASCWgAzbQzLI/iO4A3kD9YPYA6V6fQctvrWSOSp/qeIeWVZV/1HhBalMmVk+Ga+N/6V9gX9Yv+h2JfQd/aBzwk4CW4PTaAbnXHdHEO4tTxpFnKsokK5GWWK2mVc7aYI0aPOExiDfSvBKawN1oy5baCAIOqD3akdbX0SK4xjB2nJZu0z1Ct7jzXVlzXiOm+O+cgAP789iFv5Lg6ui8l8ooWDUCYxYkfahUOs3vyNghAbQWgBszj4yuATJP/jjTTDrJAgqrE+cZLH0x4zy9jrlfuz/rSG0FXlGG/N+Y4ET/NKSPWgZv19qk23l42uXJfi04eOcK2hL5z88Ztu96Q8AUnGQgbvqBRwuaFp8dIlzN/HVsZNpiHuIyE3m29vjN4vLyLPeKuRTP3uPLOuB3UfjWqyW7I5nlYgXCQLYOhst9SKI5/fMujvheKU28YVKWCbjEaAa7j2ivqQG5LEJ/o7+OYab/tXUcMbAxD2Khk3vmexbVFMFCK2Lh6N4Af1q9zERT7x+hTWrF+7+y78Fp9YOt5ys6iE3//rKhOesM2IcTnDxStFlbeLOQK//zFHnkiqmbwGzRD7I0xc8igbg10H3QVqBrzJ1r3iK0RbiHEBIfpGx9ne5ZsPDj9nJ1vejH5Z9VTC+VGWgs66khvWbtAImTHJwYk+o06Ha/OrYdEdXebfLqaIQDVZuFhkGW6Z/LHdKAHcdgOl3hPPdZgJf9hSmEabtAE+45E8dQkN5h5g/4+tcjrfEAla0Zi96j/kAZ9sARLeRMQHpFKfkmUa3H6lJy8WGDilo5k77/roa4natx7FR+WfwI0Xs5/1GRO2C4yQAfasSrv/hKYZkznPyyjdJi7CxHu6cxKTe05J5SvYZMccjhIPp4io/JvKj7byIK5fpiPWV+AQxjf4zlBCPBMP5+CE+3RsHAdh34ukYgeSXCQL2kghHE9M/KTKGLeg/ONmzXGfJ0eOTvCKiWXpfl7EmFfVcQGC5EhYQC89ppfue+zYB5g06ylDYOroRFaWId1GmTkQya9jEsNCRSN9EZ8Ol/4eyEoQEbDyfS9ToAl35c+qU7tXmb/RicueZ9SUNCxBNqbu/2w14mxCsXSIaqUCwdepVzBrXuruSO4l+lhVTsQhyLKNk2BMtsfkODAhIwHr7STg8RWdars/YZOfWM+bwM/XAsPxb5s/VoMDWXuGp5f0Kp92nfKKD/9/LSilajFvquRJ4UMWhSp3QWwuhBMKR+CqdahVJSx3ovjJFNRD4epGnUet1IndP/8ptaFvXjHicrTR56LAmvN/c3IDv7wO3E8yrbKH/AxT6bZ5/F9kxOqY2AJZRasjsP7v9kbQT9AuLgmpcU99+PHyMFUrmO6aykcfDvkGjt1sKE+9JZLt6GnonKPXG3d9kT7eD3BfJgst6FHEGuIa0/asQ/qt0A8zPzoDcz4IAEY3m4H6RPI0+YFCdOZEKQeIAa/1bXVamBFGdz5ycC1JODsC5RrkHwjJwi31JBuiMwTAdgAAA==',
    saby: 'data:image/webp;base64,UklGRjgEAABXRUJQVlA4WAoAAAAQAAAANwAANwAAQUxQSI8BAAABf8OobSNBl6S79zr+hA9EROSDAeIF6KQbQSR+cLneKandIfPAXtkMjZ+AjL8elbYgCgCybds27WjGNitG2bYR20nZ3uP/n4/2WrvwGtH/CdCfuGUrFThM4xuwkMJ7sg/8bZF/1dtDik/4ukjZIU+TlK/z0wQQSuAHIJAbMpte5jMVz/uYJWarC6J+9jCXCaUCwDm7NqqHAGD3JAI5J80AQhUCsOYhEOXIQ+T9/569ZHaT2bJ6Fg+jUQzv2GDaYXHf5qNBH8an4/20ItpNzNciteNwPM4nD0S5RDZY3Y1Qh9OOah+8fKl0G7f3qkzNjI2Ojo4M9MR71TY8Mjo6Nj1dpWS8HVlv7Kxu7u0vrWztHhweHR7sbC6v7M09fHj42KyrV5K6VbZDNRfufp4yqwW29Q6+v5x/uvL6F9wScEMOf0GDKKspuCKX8EbrBT84K7gmp9AjXc85Jp3hntyC1JkjiefyW8Mp6TewKL14K889SNeAEXWuyffErBoBabDemZqlrzxSmpfpT6QDpXo8GVsAVlA4IIICAACQDwCdASo4ADgAPpE6mUkloyIhKhM+iLASCWwAznFBfgH4q9jFins34Ac0tvr4Jw6rGB6lNuf5gP1V6ku8Z7yl+1vpAZgBM410N5uP3dvRzQiWK108foNs9htJH2FLDwmTKsSvzPbfAkX/Bja0++MMSVMalQJ2DyG2WIu/3SSI3vzIL/XIAP79NpTTA0BSrcRgwZLxVvWfHn+SWjtPUqGXv3VhljZFqyM7fxQvcuej07qfDOtGo2b8syyFNYU+Tp4NU+DuTHFuQdYygykBDFmz4dgS2nt/JKgqkB1MNU5bl8As2RTpae0kkwdyFsXpG/utgNqXDSTgfCEfWqVDe1d+IzqZqUeAwcL5cjOje1Xve598TTyrHMePCP3SG9gns2tAIQqqo4s0IKMGqQ2wE5iK+BXJll/CoD+F/7nwN2shr6QLRfWsW2RChcSbD9r8bT9c9bnv3Rsgpau7Ik1yAea2dU6ebR5t5hjkJ7yMcJ7RuRBKPE3MZXG5ix1//f+fc01V7ZIFH7q44n1vH7zYvdxT2A7tU4A96CceX/Lq7YgXNGAhj8PLVv40uFKRs8adLws39IUWN7gLWSDA4L0qyQqvrr6+OVDTH5PN+d1r/lBHYL2HjAt/yEcH6RGC1LcobMLlltafKGlIsXi5I/R2piGClMq+bhnM2l1cH3/X/Y4PhPzp2kZCdc5eOsjWJNh9BS6freYdf3FnU8VJLdm6m/QZdioeDj40egDyaWFv1PIVJEcLhWJshPdd01fGQka/ApUubp31b3XSurtV/1NPSMUvlJCTDw6NDhR2WkhauP+QAc7vwgu/FblWiqD7tsJ8gKvLL8foC973yKEzU/aqye4AAAA=',
    tensor: 'data:image/webp;base64,UklGRgICAABXRUJQVlA4IPYBAAAwCwCdASo4ADgAPpFCm0olo6IhqBgKqLASCWIA0yGNjZ2sogG2A57f0jGND4O+Stm4UtM2CwsmIMIxJ6lTIvE4kjnFIrIlhWRdgYqV/b654fmGqz2ZMvpjUPSouqVVs1S6IAD+9o57YJN4AB8ijEEwsW/41O/3lKBbUW/an5We7raS/rV7r/VjUquHUULEOKl0R4vsHMBLgBJYCDdmRBpA2a2msdOlZ7pKQNVh+J+327pZQJe0Gji/28rtvjT9PdH3Fh9doF9Xtz1jfjwPEjPhOVV2a6q3vrPvEVxrs9FqvQ5Bnho8SXFQNKpbqp7dsb19QvwctRsjYv4+FnmXhijSCkeI4hTaRmCnudUr/kZPLsHaLYoKbYWRWqM5zvEI3ZSmyEAYdRC/viOn8Mv3+FFjm6J1Q9S+R2PuRvAcJ8sGJMEhJzgr0yjHiXeWyJkEVes9B7Svzpq4updV0TkebSIgGmsvsJLNXQDAi84Or13kmyzKH3tMLWMJ0jFAztEOIwwAaJQ8Q5J4CQUsrlzow8WbpJ+BH/ZrkawQBCnrusBKLrLraEFmcM4UfnnJIBxu+XLTndKL9rY1rhLPApNEcqlUSJy7pbozlj5QhE0INsCNdvIdVNsBeQlpQZPL146aNpPIQAofn47OYJt6SzeR2ezTDi+PUAAA',
    warn: 'data:image/webp;base64,UklGRrADAABXRUJQVlA4WAoAAAAQAAAANwAANwAAQUxQSCkAAAABN6AgbQPGv+V2x0ZExNP9wEwbKf8PWEAA/o3ezhDR/wkYkf9aI4XskQBWUDggYAMAANATAJ0BKjgAOAA+hTKTR6UjIaE592gAoBCJbADMSyfQszwe+7O0a3rX/Y+bn1AeJ30gPMB+rP7Lezt+qvvL9AD+3fxbrh/RA8sr9XPg88i7//3ltRe4CrwG0Ctvll6TvGN59HzT5zfpzfufsB6ICPqsbiNWuim/aTpPclIYsggDdSAY1EyRWUrDueU12UtRHpdStOwlnU1qlE7j6WMf5q0QwqMqXpgAAP7+k5CTDu6u8vvcBFn51OEf0Me4RqheAWm/Q8/Db38FBykY5//HQ4v089XH2NrRskP6YKbCXyofoi9QG1T2ypFDaWKpw2+Q62TzIqLfG4roH7SqntTWFeRq+V2o0eppGiqfXrBHz23Ijltvj3nzCaEQEXJ6dNNlZS3vkBNytKCPh3wW/9jQPeYfkQCYIrVJbtwBjrF5+WcOW8jd75AGrtIfp+xReSOrBWdrb8cYoCFFiLbvEuzRi8tnasUcMXVdniwHemrvBe1QZyhD8FfEVpF3U0Kj2OsGkAoIKGk/RWbLTtLjUnMb8O9rOE2MP1kDyrPCz+yL9wOixePKa6NxkjWDyjG0DX0ZC3amfHWcB/HPJPQHZ/4ZoOHAFA+tEOhXwlqJYf1lxvOXkZo5CokHyEJbZ7q7cG2AChLtklst0GnxrNJQqCl3mliW0jMfai553DqoxFNqkhepXocQYHr2Ey9uhoivBUcqBeUuSYQiPGBI5LjOq+nldn+Y5dWkDZlu0do2PzX2z3lW/tlURJeSB0osZGwnISf3uKEU/pZN068ev6tkZpdRPwKSrexzYUSvgtxx4fSV+qkIGKtwgiPH+8qDn8pPvn6QhCQjPR+S6tSkfL3MJ6gXJY+h0rnah9yOzYzvvv+enVvbBqeeORuhUU2Ud1n1ZUXu9HXeIxchSCgE95RiYwK8EyOJvj6a6gJLh2SBrccdaMSuIFD2Kj6l92vvs76dk/5cpIu1QputmvqVvxUOK5X5x4jJb/QXiwsYMK9y5dj1Y0Pyxackhx+HasRK3zFvWUo2HVha2JNbUP1RCi6XDdLkSraS8U0ggPZ7GCDtFKARyFdK9Maz3Xwzx629vRjq5kCK5fJN2o0Rk8Nd8Ymq6/8DqPAmdyJVGXBUZ/NQRD4Dn1fLedQcXvvYmHX2frMLOAAAAA==',
};
export const DATA = [
    {
        key: '1',
        caption: 'Чтобы успеть получить премии',
        description: '1. Зарплата за февраль - 7 марта.',
        image: IMAGES.money,
    },
    {
        key: '2',
        caption: 'Стартовал проект "Смена статуса резидента и НДФЛ дистанционных сотрудников"',
        description:
            'Расчет при смене статуса с резидента на нерезидента и в обратную сторону с пересчетом по последней ставке с начала года',
        image: IMAGES.monkey,
    },
    {
        key: '3',
        caption: 'Планы на неделю 04.03 - 10.03',
        description: '04.03 - работы на бою выполняются в штатном режиме;',
        image: IMAGES.saby,
    },
    {
        key: '4',
        caption: 'Стартовал проект "Saby Staff. Виджеты для конфигураций КЭДО и КУ"',
        description:
            'Улучшить интерфейс приложения Saby Staff (рабочего места кадровика) и сделать его использование более удобным',
        image: IMAGES.money,
    },
    {
        key: '5',
        caption: 'Завершен проект Брендированные мобильные приложения на аккаунте Клиента',
        description: 'Завершен проект Брендированные мобильные приложения на аккаунте Клиента',
        image: IMAGES.app,
    },
    {
        key: '6',
        caption: 'С 1 апреля меняем тарификацию ЭДО',
        description:
            'Если клиент отправил документов больше, чем предусмотрено его тарифом Отчетности',
        image: IMAGES.warn,
    },
    {
        key: '7',
        caption: 'Планы на неделю 04.03 - 10.03',
        description: '04.03 - работы на бою выполняются в штатном режиме;',
        image: IMAGES.monkey,
    },
    {
        key: '8',
        caption: 'Стартовал проект "Смена статуса резидента и НДФЛ дистанционных сотрудников"',
        description:
            'Реализовать сбор и представление основной статистики облака с точностью до минуты и хранением такой статистики в течении 5 дней',
        image: IMAGES.saby,
    },
];

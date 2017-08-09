import good from 'good'

export const goodPluginObj = {
    register: good,
    options: {
        reporters: {
            console: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{
                        log: '*',
                        response: '*'
                    }]
                },
                {
                    module: 'good-console'
                }, 'stdout'
            ]
        }
    }
}
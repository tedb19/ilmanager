import good from 'good'

export const goodPluginObj = {
    register: good,
    opsInterval: 30*60*1000,
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
            ],
            file:  [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*', request: '*', error: '*' }]
            }, {
                module: 'good-squeeze',
                name: 'SafeJson',
                args: [
                    null,
                    { separator: ',\n' }
                ]
            }, {
                module: 'rotating-file-stream',
                args: [
                    'ops_log.json',
                    {
                        size: '300K',
                        path: './logs'
                    }
                ]
            }]
        }
    }
}
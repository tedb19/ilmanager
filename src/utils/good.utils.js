import good from 'good'

export const goodPluginObj = {
    register: good,
    options: {
        ops: {
            interval: 1000 * 60 * 10 //10 minutes
        },
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
                args: [{ log: '*', ops: '*', response: '*', request: '*', error: '*' }]
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
                        path: '../../logs',
                        maxFiles: 10
                    }
                ]
            }]
        }
    }
}
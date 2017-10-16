# ILManager

## Description
  - This is the REST API for the IL, with endpoints for getting the `Participating Systems`, `Message Types`,<br/>
   `Message Subscriptions`, `Usage Stats` and `Notifications`

## Setup steps
  - First you need to install `nodejs` and [pm2](http://pm2.keymetrics.io/)
  - To create a build, run the following:
  
    ### `npm run build`

      > Transpiles the `ES7` and `ES6` javascript to `ES5`, in a dist folder<br>
      > Copies the node_modules folder to the dist folder.<br>
      > Copies the config dir to the dist directory 

    ### `pm2 start dist/src/lib/index.js -i max`

      > Once you create the `dist`, you can copy it to your production server, and run the `pm2` command.
      > This command runs up the API, with the `cluster mode` activated. This means the API will utilize     all the available CPU cores available, for an optimized performance.

    ### `pm2 startup`
    
      > 
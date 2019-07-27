const Router = require('koa-router');
const router = new Router();
const github = require("../../github");

router.prefix('v1');


router
    .post('/', async (ctx,next) => {
        let event_handled = await github.webhook.handle(ctx.request);
        if (event_handled) {
            console.log(`Event is handled: ${ctx.request.get('X-GitHub-Event')}`);
            ctx.ok({ event: ctx.request.get('X-GitHub-Event') });
        } else {
            console.error(`Error occured while handling the webhook event. ${ctx.request.get('X-GitHub-Event')}`);
            ctx.notImplemented({ event: ctx.request.get('X-GitHub-Event') });
        }
    }).get('/', (ctx, next) => {
        ctx.ok({ message: "Hello Brozz!!" });
    });

module.exports = router.routes();
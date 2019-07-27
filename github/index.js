const util = require("util");
const exec = util.promisify(require("child_process").exec);
const crypto = require("crypto");

const deploy = async() => {
    try {
        let {stderr, stdout} = process.env.NODE_ENV === "development" ? await exec(`cd ${__dirname} && ./deploy_dev.sh`) : await exec(`cd ${__dirname} && ./deploy.sh`);
        if (stderr.trim() === "") {
            console.log(stdout);
            return true;
        } else {
            console.error(`Error occured while trying to deploy new version. ${stderr}`);
        }    
    } catch (error) {
        console.error(`Error occured while trying to deploy new version. ${error}`);
    }
    return false;
}

const github = {
    security: {
        checkSignatures(request) {
            const providedSignature = request.get("x-hub-signature");
            const generatedSignature = this._generateSignature(request.body);
            return crypto.timingSafeEqual(Buffer.from(providedSignature), Buffer.from(generatedSignature));
        },
        _generateSignature(payload) {
            const hmac = crypto.createHmac('sha1', process.env.HOOK_SECRET);
            const self_signature = hmac.update(JSON.stringify(payload)).digest('hex');
            return `sha1=${self_signature}`;
        }
    },
    webhook: {
        async handle(request) {
            switch (request.get('X-GitHub-Event')) {
                case "push":
                    return this.handlePushEvent(request.body);                    
                default:
                    return false;
            }
        },
        async handlePushEvent(data) {
            let branch = data.ref;
            let senderUsername = data.sender.login;
            if (branch.indexOf("master") != -1 && senderUsername === process.env.GITHUB_USER) {
                return await deploy();
            }
            return false;
        }
    }
}

module.exports = github;

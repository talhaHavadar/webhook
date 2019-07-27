const util = require("util");
const exec = util.promisify(require("child_process").exec);

const deploy = async() => {
    try {
        let {stderr, stdout} = await exec(`cd ${__dirname} && ./deploy.sh`);
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

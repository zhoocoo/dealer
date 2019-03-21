let co = require('co');
let prompt = require('co-prompt');
let chalk = require('chalk');
let templates = require('../templates');
let download = require('download-git-repo');
let ora = require('ora');
let fs = require('fs');
let util = require('./util.js');
let path = require('path');
let temps = {}
let temps2 = {}



function getTemps(templates){
    for(let key in templates.list){
        let item = templates.list[key];
         temps[key] = item.name;
         temps2[item.name] = item.path;
    }
}

let generator = function *(name){
    let tempName = name;
    let tempPath = temps2[name];
    if(!name){
        console.log(' 可用模板列表');
        for(let key in temps){
            let tempName = temps[key];
            console.log(` ${chalk.green(key)}:${chalk.green(tempName)}`);
            tempName = yield prompt(' 请选择模板类型：');
            tempPath = temps2[temps[tempName]];
        }
    }
    if(temps[tempName] || temps2[tempName]){
        console.log('------------------------');
        let projectName = yield prompt(" 请输入项目名称(demo)");
        if(!projectName){
            projectName = "demo";
        }
        console.log('------------------------');
        downloadTemplates(tempPath,projectName);
    }else{
        console.log(chalk.red( `   ✘模版[${tempName}]不存在`))
        process.exit(0)
    }
}

function downloadTemplates(tempPath,projectName){
    let spanner = ora(' 正在构建中------');
    spanner.start();
    if(fs.existsSync('download')){
        util.remdirSync('download');
    }
    download(tempPath,path.join(__dirname,'download'),function(err){
        if(err){
            spanner.stop();
            console.log('  ','---------------------------------');
            console.log('  ',chalk('✘构建失败'),err);
            process.exit(0);
        }
        startBuildProject(spanner,projectName);
    })
}

function startBuildProject(spanner,projectName){
    let targetPath = path.join(process.cwd(),projectName);
    util.copyDirSync(path.join(__dirname,'download'),targetPath);
    console.log('  ','--------------------');
    console.log('  ',chalk.green('★'),chalk.green('项目构建成功'));
    spanner.stop();
    process.exit(0);
}

module.exports = function(name){
    getTemps(templates);
    co(generator(name));
}
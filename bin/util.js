const fs = require('fs');
const path = require('path');
class DirHelper {
 static copyDirSync(from, to) {
   let files = [];
   if (fs.existsSync(to)) { // 文件是否存在 如果不存在则创建
     files = fs.readdirSync(from);
     files.forEach((file) => {
       const targetPath = path.join(from, file);
       const toPath = path.join(to, file);
       if (fs.statSync(targetPath).isDirectory()) { // 复制文件夹
         DirHelper.copyDirSync(targetPath, toPath);
       } else { // 拷贝文件
         fs.copyFileSync(targetPath, toPath);
       }
     });
   } else {
     fs.mkdirSync(to);
     DirHelper.copyDirSync(from, to);
   }
 }

 static remdirSync(paths) {
   let files = [];
   if (fs.existsSync(paths)) {
     if (fs.statSync(paths).isDirectory()) {
       files = fs.readdirSync(paths);
       files.forEach((file) => {
         const curPath = path.join(paths, file);
         if (fs.statSync(curPath).isDirectory()) {
           DirHelper.remdirSync(curPath);
         } else {
           fs.unlinkSync(curPath);
         }
       });
       fs.rmdirSync(paths);
     } else {
       fs.unlinkSync(paths);
     }
   }
 }

 static readFile(filepath) {
   if (!fs.existsSync(filepath)) return '';
   const str = fs.readFileSync(filepath, 'utf-8');
   return str;
 }

 static mkdirsSync(dirname) {
   console.log(fs.existsSync(dirname))
   if (fs.existsSync(dirname)) {
     return true;
   }
   if (DirHelper.mkdirsSync(path.dirname(dirname))) {
     fs.mkdirSync(dirname);
     return true;
   }
   return false;
 }
}
module.exports = DirHelper
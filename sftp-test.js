// /*
//  * @Author: xieshengyong
//  * @Date: 2021-12-16 19:45:23
//  * @LastEditTime: 2023-07-13 10:00:51
//  * @LastEditors: xieshengyong
//  */
// let fs = require('fs');
// let Client = require('ssh2-sftp-client');

// const server3 = () => {
//     let sftp = new Client();
//     sftp.connect({
//         host: '8.135.58.157',
//         port: '22',
//         username: 'www',
//         privateKey: fs.readFileSync('../id_rsa')
//     }).then(() => {
//         return sftp.uploadDir('dist', '/developmemt/sjzjbyyz.treedom.cn');
//     }).then(data => {
//         console.log('sftp 3上传成功：', data);
//     }).catch(err => {
//         console.log(err, 'catch error');
//     }).finally(() => {
//         sftp.end();
//     });
// };
// server3();

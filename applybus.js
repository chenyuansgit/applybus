/**
 * Created by chenyuan on 2017/4/16.
 */

'use strict';

let evh = require('express-vhost');
let express = require('express');
let fs = require("fs");
let path = require("path");
var cookieParser = require('cookie-parser');

let server = express();
//server.enable('trust proxy');

class MultiAppServer {

    constructor(port) {
        this.port = port;
    }

    start() {
        let siteList = this.getSiteList();
        for (let i = 0; i < siteList.length; i++) {
            let siteName = siteList[i];
            let router = require(path.join(__dirname, "site", siteName, "router"));
            evh.register(siteName, this.appFactory(siteName, router));
        }
        server.use(evh.vhost(server.enabled('trust proxy')));
        server.listen(this.port);
    }


    appFactory(siteName, router) {
        var app = express();
        // view engine setup
        app.set('views', path.join(__dirname, 'site', siteName, 'views'));
        app.set('view engine', 'ejs');
        // 设置cookie中间件
        app.use(cookieParser('Secret'));
        // 访问
        app.use(function(req, res, next){
            console.log('req:', siteName, req.url);
            next();
        });
        // 设置路由
        app.use(router);
        return app;
    }

    getSiteList() {

        let siteList = [];
        let directoryFileList = fs.readdirSync(path.join(__dirname, "site"));
        for (let i = 0; i < directoryFileList.length; i++) {
            let stats = fs.statSync(path.join(__dirname, "site", directoryFileList[i]));
            if (stats.isDirectory() === true) {
                siteList.push(directoryFileList[i])
            }
        }
        return siteList;
    }


}

var AS = new MultiAppServer(30004);
AS.start();
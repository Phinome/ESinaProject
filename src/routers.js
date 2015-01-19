/**
 * backbone路由表
 * 写这个的目的在于当我需要对某个模块进行md5化的时候，这里能通过打包配置路由关系
 * 因为再app.js中比如
 * home/index 这是通过module, action进行拼装的，无法直接通过文本扫描匹配替换
 */
requirejs.config({
    paths: {
        "home/index" : "scripts/module/home/index",
        "sites/index" : "scripts/module/group/index"
    }
});
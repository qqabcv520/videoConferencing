const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin"); //html模板插件
const ExtractTextPlugin = require("extract-text-webpack-plugin"); //css分割插件
const CleanWebpackPlugin = require("clean-webpack-plugin"); // 删除旧bundle插件
const autoprefixer = require("autoprefixer");//css自动添加浏览器前缀
// const { CheckerPlugin } =  require("awesome-typescript-loader")

module.exports = {
    entry: {//输入文件
        vendor: ["vue"],
        app: "./app/app.ts"
    },
    output: {//输出文件
        path: path.join(__dirname, "build"),// 输出目录build
        filename: "scripts/[name].[chunkhash:6].js",
        publicPath: "/videoConferencing/build"
        // chunkFilename: "chunks/[name].chunk.[chunkhash].js"
    },
    module: {//模块加载器配置

        //加载器配置
        loaders: [{
            test: /\.css$/,//正则匹配拓展名为css的文件
            loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    "css-loader?importLoaders=1",
                    "postcss-loader"
                ]
            })
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    "css-loader?importLoaders=2",
                    "postcss-loader",
                    "less-loader"
                ]
            })
        }, {
            test: /\.html$/,
            loader: "html-loader"
        }, {
            test: /\.(gif|jpg|png)$/,
            loader: "url-loader?limit=8192&name=/images/[name].[hash:6].[ext]" // 内联的base64的图片地址，图片要小于8k，直接的url的地址则不解析
        }, {
            test: /languages\\[\w-]+\.json$/,    //国际化json
            loader: "file-loader?name=/languages/[name].[ext]"
        }, {
            test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
            loader: "url-loader?limit=1000&name=/fonts/[name].[ext]"
        }, {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: "babel-loader?presets[]=es2015&cacheDirectory=true"//cacheDirectory开启缓存
        }, {
            test: /\.ts$/,
            exclude: /(node_modules|bower_components)/,
            loader: "awesome-typescript-loader"
        }]
    },
    externals: {
        // // require("jquery") 是引用自外部模块的
        // // 对应全局变量 jQuery
        // angular: "angular",
        // jquery: "jQuery"

    },
    plugins: [

        new HtmlWebpackPlugin({//单独生成html文件
            filename: "index.html",//生成的html及存放路径，相对于path
            template: "./app/index.html",//载入文件及路径
            publicPath: "",//这是build文件下html文件引用js文件的路径
            chunks: ["manifest", "vendor", "app"]//需要引入的chunk，不配置就会引入所有页面的资源
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ["manifest", "vendor"], //name是提取公共代码块后js文件的名字。
            chunks: ["app"] //只有在vendor中配置的文件才会提取公共代码块至manifest的js文件中
        }),
        new webpack.HashedModuleIdsPlugin(), //各模块由编号有数字序号变为哈希，公共模块增减时编码不变，防止chunkhash变化
        new CleanWebpackPlugin("build", {//打包前删除 build 目录
            verbose: true,// 将log写到 console.
            dry: false // 不要删除任何东西，主要用于测试.
            //exclude: ["files", "ignore"]//排除不删除的目录，主要用于避免删除公用的文件
        }),
        new ExtractTextPlugin("styles/[name].[hash:6].css"),//分割后的CSS
        new webpack.LoaderOptionsPlugin({//loader选项
            options: {
                postcss: function(){
                    return [
                        autoprefixer({
                            browsers: [
                                "last 3 versions",
                                "ie >= 10",
                                "ie_mob >= 10",
                                "ff >= 30",
                                "chrome >= 34",
                                "safari >= 6",
                                "opera >= 12.1",
                                "ios >= 6",
                                "android >= 4.4",
                                "bb >= 10",
                                "and_uc 9.9",
                            ]
                        })
                    ]
                }
            }
        })
    ],
    // devtool: "source-map",
    resolve: {
        alias: {//路径重定向
            // bootstrapCss: path.resolve(__dirname, "./app/commons/bootstrapLoad/bootstrap.less"),
        },
        extensions: [".ts", ".js"]//默认后缀
    },
    devServer: { //本地服务器配置
        // contentBase: "build/",
        historyApiFallback: true,
        hot: true,
        inline: true
    }
};
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const path = require('path')
const webpack = require('webpack')

const { CleanWebpackPlugin } = require ('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require ('image-minimizer-webpack-plugin')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirShared = path.join(__dirname, 'shared')
const dirAssets = path.join(__dirname, 'assets')
const dirStyles = path.join(__dirname, 'styles')
const dirNode = 'node_modules'

module.exports = { //simplifies calling files
    entry: [
        path.join(dirApp, 'index.js'),
        path.join(dirStyles,'index.scss')
    ],
    resolve: {

        modules: [
            dirApp,
            dirShared,
            dirStyles,
            dirAssets,
            dirNode
        ]
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    plugins: [ //repackages webpack to shared folder
        new webpack.DefinePlugin({
            IS_DEVELOPMENT
        }),
        new webpack.ProvidePlugin({

        }),
        new CopyWebpackPlugin ({
           patterns: [{
                from: './shared',
                to: ''
           }]

        }),

        new MiniCssExtractPlugin({
            filename : '[name].css',
            chunkFilename : '[id].css'
        }),

        new CleanWebpackPlugin()


    ],
        module: { //allows babel to rework js to fit out dated web clients
            rules: [
            {

                test:/\.js$/,
                use: {
                    loader: 'babel-loader'
                }
            },

            {
                test: /\.scss$/,
                use: [
                    {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: ''
                    }
                    },
                    {
                        loader:'css-loader',
                    },
                    {
                        loader:'postcss-loader',
                    },
                    {
                        loader: 'sass-loader'
                    }

                ]
            },
            { //rename images in shared folder to hash.(file type)
                test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
                loader: 'file-loader',

                options: {
                    outputPath: 'media',
                    name(file){
                        return '[hash].[ext]'
                    }
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/,
                use : [
                    {

                    loader: ImageMinimizerPlugin.loader,

                  }
                ]
            },
            {
                test:/\.(glsl|frag|vert)$/,
                loader: 'raw-loader',
                exclude: /node_modules/

            },
            {
                test:/\.(glsl|frag|vert)$/,
                loader: 'glslify-loader',
                exclude: /node_modules/

            }
        ]
    }
}

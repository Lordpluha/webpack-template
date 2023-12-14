const HtmlWebpackPlugin = require('html-webpack-plugin'),
	  CopyWebpackPlugin = import('copy-webpack-plugin'),
	  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	  TerserPlugin = require("terser-webpack-plugin"),
	  OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'),
	//   TerserWebpackPlugin = import('import-webpack-plugin'),
	  ESLintPlugin = require('eslint-webpack-plugin'),
	  path = require('node:path'),
	  fs = require('fs')

/**
 * @author Lordpluha <Tesluakevlad@gmail.com>
 * @version 1.0.0
 *
 * @copyright Teslyuk Vlad 2020
 * @license GNUv3
 */

const srcFolder = path.join(__dirname, 'src'),
	distFolder = path.join(__dirname, 'dist'),
	https = true,
	OSPanel = false,
	isDev = process.env.NODE_ENV !== "production",
	isProd = !isDev

const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

const vendorConfig = {
	context: srcFolder,
	target: 'web',
	entry: {
		app: [
			'@babel/polyfill',
			'./assets/js/script.js'
		],
	},
	resolve: {
		alias: {
			"@": srcFolder,
			"@assets": path.join(srcFolder, 'assets'),
			'@img': path.join(srcFolder, 'assets/img'),
			'@fonts': path.join(srcFolder, 'assets/fonts/'),
			'@certs': path.join(srcFolder, 'certs/'),
			"@js": path.join(srcFolder, 'assets/js/'),
			"@scss": path.join(srcFolder, 'assets/styles/')
		},
		extensions: ['.js', '.json', '.jsx', '.ts', '.tsx']
	},
	optimization: {
		splitChunks: {
			chunks: 'all'
		},
		minimize: isProd,
		minimizer: isProd ? [
			new OptimizeCSSAssetsWebpackPlugin(),
			new TerserPlugin()
		] : [],
	},
	output: {
		clean: true,
		path: distFolder,
		filename: filename('js')
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './pages/index.html',
			hash: isProd,
			minify: {
				collapseWhitespace: isProd
			},
			meta: {
				'charset': {
					'charset': 'UTF-8'
				},
				'X-UA-Compatible': {
					'http-equiv': 'X-UA-Compatible',
					content: 'IE=edge'
				},
				'content-language': {
					'http-equiv': 'content-language',
					content: 'en'
				},
				'content-type': {
					'http-equiv': 'content-type',
					content: 'text/html'
				},

				// Security
				'Content-Security-Policy': {
					'http-equiv': 'Content-Security-Policy',
					content: `
						default-src 'self';
						script-src 'self' 'unsafe-inline' 'unsafe-eval';
						font-src 'self' https://fonts.gstatic.com/;
						style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/;
						img-src 'self'
					 `
				},
				'license': 'href/url',

				// Design info
				'theme-color': '#ffffff',
				viewport: 'width=device-width, initial-scale=1.0',
				'canonical': {
					rel: 'canonical',
					href: 'https://github.com/Lordpluha'
				},
				'icon': {
					rel: 'icon',
					href: ''
				},
				'apple-touch-icon': {
					rel: 'apple-touch-icon',
					href: ''
				},
				'mask-icon': {
					rel: 'mask-icon',
					href: '',
					color: ''
				},

				// CEO
				'robots': 'index, follow',
				'googlebot': 'index, follow',
				'googlebot-news': 'noindex',
				'description': '',
				'subject': '',
				'keywords': '',
				'application-name': '',
				'author': 'https://github.com/Lordpluha',
				'article:author': {
					rel: 'article:author',
					content: ''
				},

				// Website ownership
				'google-site-verification': '',
				'yandex-verification': '',
				'msvalidate.01': '',
				'alexaVerifyID': '',
				'p:domain_verify': '',
				'norton-safeweb-site-verification': '',

				// Open Graph Protocol
				'og:title': {
					property: 'og:title',
					content: ''
				},
				'og:description': {
					property: 'og:description',
					content: ''
				},
				'og:image': {
					property: 'og:image',
					content: ''
				},
				'og:image:secure_url': {
					property: 'og:image:secure_url',
					content: ''
				},
				'og:image:alt': {
					property: 'og:image:alt',
					content: ''
				},
				'og:image:type': {
					property: 'og:image:type',
					content: 'image/jpg'
				},
				'og:url': {
					property: 'og:url',
					content: ''
				},
				'og:site_name': {
					property: 'og:site_name',
					content: ''
				},
				'og:type': {
					property: 'website',
					content: ''
				},
				'og:locale': {
					property: 'en_US',
					content: ''
				},
				'fb:app_id': {
					property: 'fb:app_id',
					content: ''
				},

				// GEO information
				'ICBM': 'latitude, longitude',
				'geo.position': 'latitude;longitude',
				'geo.region': 'country[-state]',
				'geo.placename': 'city/town',
				'me': {
					rel: 'me',
					href: 'https://github.com/Lordpluha'
				},

				// Twitter
				'twitter:card': 'summary',
				'twitter:site': '@site_account',
				'twitter:creator': '@individual_account',
				'twitter:url': '',
				'twitter:title': '',
				'twitter:description': '',
				'twitter:image': '',
				'twitter:image:alt': '',
				'twitter:dnt': 'on'
			}
		}),
		// new CopyWebpackPlugin({
		// 	patterns: [
		// 		{
		// 			from: 'assets',
		// 			to: distFolder,
		// 			noErrorOnMissing: true,
		// 			globOptions: {
		// 				ignore: []
		// 			}
		// 		}
		// 	]
		// }),
		new MiniCssExtractPlugin({
			filename: filename('css')
		}),
		new ESLintPlugin({
			context: './src/',
			failOnError: isProd
		})
	],
	module: {
		rules: [
			{
				test: /\.s[ca]ss$/,
				use: [
					isDev
            			? "style-loader"
            			: MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							sourceMap: isDev,
						},
					},
					{
						loader: "sass-loader",
						options: {
							implementation: require.resolve("sass"),
							sourceMap: isDev,
							warnRuleAsWarning: isDev,
							api: "modern",
							sassOptions: {
								outputStyle: "compressed",
							},
						},
					},
				]
			},
			{
				test: /\.css$/,
				use: ['style-loader', "css-loader"]
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ['@babel/preset-env', '@babel/preset-typescript'],
					}
				}
			},
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
					}
				}
			},
			{
				test: /\.(png|svg|jpe?g|gif)$/i,
				type: 'asset/resource',
				use: ['file-loader']
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				use: ['file-loader']
			}
		]
	}
}

const devConfig = Object.assign({
	name: "dev",
	mode: "development",
	devtool: 'eval',
	devServer: {
		open: true,
		// open: {
		// 	target: ['index.html']
		// },
		// static: {
		// 	directory: distFolder,
		// 	publicPath: '/public',
		// 	watch: true,
		// 	serveIndex: true
		// },
		compress: true,
		// port: 8080,
		client: {
			logging: 'info',
			overlay: {
				errors: true,
				warnings: false,
				runtimeErrors: true
			},
		},
		// http2: https,
		server: https
			? {
				type: 'https',
				options: {
					// key: fs.readFileSync(path.join(srcFolder, 'assets/certs/webpack-2023+1-key.pem')),
					ca: fs.readFileSync(path.join(srcFolder, 'certs/webpack-2023+1.pem')),
					// pfx: fs.readFileSync(path.join(srcFolder, 'assets/certs/webpack-2023+1.p12')),
					// passphrase: 'changeit',
					// requestCert: true
				}
			}
			: 'http',
		proxy: OSPanel ? {'/': 'http://webpack-2023/src/'} : {},
		headers: {

		},

		watchFiles: [
			'src/**/*.php',
			'src/**/*.html',
			'src/**/*.scss',
			'src/**/*.js',
			'src/**/*.jsx',
			'assets/**/*'
		],
	},
	stats: {
		loggingDebug: ["sass-loader"],
	}
}, vendorConfig)

const prodConfig = Object.assign({
	name: "prod",
	mode: "production"
}, vendorConfig)

module.exports = [
	devConfig,
	prodConfig
]
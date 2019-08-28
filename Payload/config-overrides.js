const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());

module.exports = function override(config, env) {
	config.resolve.plugins = config.resolve.plugins.filter(
		plugin => !(plugin instanceof ModuleScopePlugin)
	);

	/* If this breaks, check react-scripts webpack.config.js.
     This should change the 'babel-loader' (inside the oneOf definition)
     plugin to include the Common folder */
	config.module.rules[2].oneOf[1].include = [
		path.resolve(appDirectory, 'src/'),
		path.resolve(appDirectory, '../Common/')
	];

	return config;
};

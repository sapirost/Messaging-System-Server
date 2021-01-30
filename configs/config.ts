// tslint:disable:no-console
import { statSync } from 'fs';
import { isFinite, merge, set } from 'lodash';
import { join, resolve } from 'path';
import { name } from '../package.json';

const CONFIGURATIONS_SETTINGS = {
    defaultConfigurationFileName: 'default-settings.json',
    filePrefix: 'settings-',
    fileExtension: '.json',
};

const configuration = {
    DIR_NAME: '',

    getConfigurations(dirname: any = __dirname, nodeEnvironment: any = null) {
        const nodeEnv = nodeEnvironment || process.env.NODE_ENV;
        configuration.DIR_NAME = join(dirname);

        console.log('Starting System Configuration =>', JSON.stringify({ nodeEnv, dirname: configuration.DIR_NAME }));

        const conf = merge(
            {},
            { appName: name, environment: nodeEnv },
            configuration.getDefaults(),
            configuration.getEnvironment(nodeEnv),
            configuration.getGlobals()

        );

        return conf;
    },

    fileExists(fileName: string) {
        let fileExists = false;
        const file = resolve(configuration.DIR_NAME, fileName);

        try {
            const filestat = statSync(file);

            fileExists = filestat.size > 0;
        } catch (err) {
            fileExists = false;
        }

        return fileExists;
    },

    getDefaults() {
        console.log(`Default Config File loaded => '${CONFIGURATIONS_SETTINGS.defaultConfigurationFileName}'`);

        return require(`${configuration.DIR_NAME}/${CONFIGURATIONS_SETTINGS.defaultConfigurationFileName}`);
    },

    getEnvironment(nodeEnv: string) {
        const configFile = `${CONFIGURATIONS_SETTINGS.filePrefix}${nodeEnv}${CONFIGURATIONS_SETTINGS.fileExtension}`;

        if (!configuration.fileExists(`${configuration.DIR_NAME}/${configFile}`)) {
            console.log('*****************************************************');
            console.log('****** NO ENVIRONMENT CONFIGURATION WAS LOADED ******');
            console.log(`****** ENVIRONMENT: '${nodeEnv}' *******`);
            console.log('*****************************************************');

            return;
        }

        console.log(`Config File loaded => '${configFile}'`);

        return require(`${configuration.DIR_NAME}/${configFile}`);
    },

    getGlobals() {
        const glob = {};
        console.log("process.env", process.env)

        Object.keys(process.env).forEach(key => set(glob, configuration.normalizeKey(key), configuration.getParseValue(process.env[key])));

        return glob;
    },

    normalizeKey(key: string) {
        return key.trim().replace(/_/g, '.');
    },

    getParseValue(val: any) {
        if (isFinite(+val)) {
            return +val;
        }
        if (val === 'true') {
            return true;
        }
        if (val === 'false') {
            return false;
        }

        try {
            return JSON.parse(val);
        } catch (e) {
            // Do nothing
        }

        return val;
    },
};

export const config = configuration.getConfigurations();

export default (dirname: string) => {
    return configuration.getConfigurations(dirname);
};

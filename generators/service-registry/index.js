'use strict';
const BaseGenerator = require('../base-generator');
const prompts = require('./prompts');
const path = require('path');

module.exports = class extends BaseGenerator {

    constructor(args, opts) {
        super(args, opts);

        this.configOptions = this.options.configOptions || {};
    }

    initializing() {
        this.logSuccess('Generating Service Registry');
    }

    get prompting() {
        return prompts.prompting;
    }

    configuring() {
        this.destinationRoot(path.join(this.destinationRoot(), '/'+this.configOptions.appName));
        this.config.set(this.configOptions);
    }

    writing() {
        this.generateBuildToolConfig(this.configOptions);
        this.generateDockerConfig(this.configOptions);
        this.generateJenkinsfile(this.configOptions);
        this.generateTravisCIfile(this.configOptions);
        this._generateAppCode();
    }

    end() {
        this.printGenerationSummary(this.configOptions);
    }

    _generateAppCode() {
        const mainJavaTemplates = ['ServiceRegistryApplication.java'];
        this.generateMainJavaCode(this.configOptions, mainJavaTemplates);

        const mainResTemplates = ['application.properties'];
        this.generateMainResCode(this.configOptions, mainResTemplates);

        const testJavaTemplates = ['ServiceRegistryApplicationTests.java'];
        this.generateTestJavaCode(this.configOptions, testJavaTemplates);

    }

};

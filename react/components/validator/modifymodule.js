/* eslint-disable-next-line no-unused-vars */
const React = require("react");

const ValidatorModule = require("./validatormodule.js");

class ModifyModule extends ValidatorModule {
  constructor(props) {
    super(props);
    this.icon = "pencil";
    this.label = "Modifier les données de l'opération";
    this.buttonText = "Modifier";
    this.buttonLink = `${this.linkBase}update`;
  }
}
ModifyModule.displayName = "ModifyModule";

module.exports = ModifyModule;

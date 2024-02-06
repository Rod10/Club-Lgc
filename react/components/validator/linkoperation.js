/* eslint-disable-next-line no-unused-vars */
const React = require("react");

const ValidatorModule = require("./validatormodule.js");

class LinkOperation extends ValidatorModule {
  constructor(props) {
    super(props);
    this.icon = "link";
    this.label = "Créer une opération liée";
    this.buttonText = "Créer";
    this.buttonLink = `/society/operation/new?link=${this.props.operation.id}`;
  }
}
LinkOperation.displayName = "LinkOperation";

module.exports = LinkOperation;

const React = require("react");

const ContributorHabilitationList = require("../preedwin/contributorhabilitationlist.js");

const Head = require("../helpers/head.js");

class ContributorHabilitationListPage extends React.Component {
  render() {
    return <div className="container is-fluid">
      <Head img="/images/icons/address-card-solid.svg">
        Habilitations
      </Head>
      <ContributorHabilitationList {...this.props} />
    </div>;
  }
}
ContributorHabilitationListPage.displayName = "ContributorHabilitationListPage";

module.exports = ContributorHabilitationListPage;

const React = require("react");
const PropTypes = require("prop-types");

const Notifications = require("../bulma/notifications.js");
const NewContributorList = require("../contributorlist/newindex.js");

const Head = require("../helpers/head.js");

class NewOperatorsArchive extends React.Component {
  render() {
    return <div className="container is-fluid">
      <div>
        <Head img="/images/icons/address-card-solid.svg">
          Archive des opérateurs
        </Head>
        <div>
          <NewContributorList archived {...this.props} />
        </div>
      </div>
      <Notifications />
    </div>;
  }
}
NewOperatorsArchive.displayName = "NewOperatorsArchive";
/* eslint-disable react/no-unused-prop-types */
NewOperatorsArchive.propTypes = {
  alreadyExists: PropTypes.bool,
  canManageRights: PropTypes.bool,
  functions: PropTypes.array.isRequired,
  operator: PropTypes.object,
  nbEmail: PropTypes.number,
  newOperator: PropTypes.bool,
  preEdwin: PropTypes.bool,
};
/* eslint-enable react/no-unused-prop-types */
NewOperatorsArchive.defaultProps = {
  alreadyExists: false,
  canManageRights: false,
  nbEmail: undefined,
  newOperator: false,
  operator: undefined,
  preEdwin: false,
};

module.exports = NewOperatorsArchive;

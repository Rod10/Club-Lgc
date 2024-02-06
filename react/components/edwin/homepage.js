const React = require("react");
const PropTypes = require("prop-types");

const Group = require("../homepage/group.js");
const Head = require("../homepage/head.js");

const Options = require("../../../express/utils/options.js");
const PlanTypes = require("../../../express/constants/plantypes.js");
const EdwinLinks = require("../../../express/constants/links.js");

class Homepage extends React.Component {
  static getSearchStringFromStates(entries) {
    const search = new URLSearchParams();
    for (const entry of entries) {
      if (Array.isArray(entry.value)) {
        for (const value of entry.value) {
          search.append(entry.key, value);
        }
      } else {
        search.append(entry.key, entry.value);
      }
    }
    return search.toString();
  }

  constructor(props) {
    super(props);

    if (props.society) {
      this.options = props.society.options;
    } else {
      this.options = new Options();
    }
    if (!(this.options instanceof Options)) {
      this.options = new Options(this.options);
    }
  }

  _renderDocs() {
    const planType = this.props.society.subscription.planType;

    let normesDoc = null;
    let practicesDoc = null;
    if (planType === PlanTypes.Courante) {
      normesDoc = "/documents/normes_et_documents_courante.pdf";
      practicesDoc = "/documents/edwin_en_pratique_courante.pdf";
    } else if (planType === PlanTypes.Ep) {
      normesDoc = "/documents/normes_et_documents_ep.pdf";
      practicesDoc = "/documents/edwin_en_pratique_ep.pdf";
    } else if (planType === PlanTypes.Byes) {
      normesDoc = "/documents/normes_et_documents_byes.pdf";
      practicesDoc = "/documents/edwin_en_pratique_byes.pdf";
    } else {
      normesDoc = "/documents/normes_et_documents.pdf";
      practicesDoc = "/documents/edwin_en_pratique.pdf";
    }

    return <div className="columns content">
      <div className="column" />
      <div className="group column is-one-third has-text-centered">
        <a
          className="title reference"
          href={normesDoc}
          target="_blank"
          rel="noreferrer"
        >
          <img src="/images/icons/docs.svg" />
          <span>NORMES ET DOCUMENTS</span>
        </a>
      </div>
      {this._renderGroup(EdwinLinks.statistic)}
      <div className="group column is-one-third has-text-centered">
        <a
          className="title reference"
          href={practicesDoc}
          target="_blank"
          rel="noreferrer"
        >
          <img src="/images/svg/home_edwin_pratique.svg" />
          <span>EDWIN EN PRATIQUE</span>
        </a>
      </div>
    </div>;
  }

  _renderGroup(group) {
    return <Group
      img={group.logo}
      title={group.label}
      actions={group.routes
        .filter(route => !route.canAccess || route.canAccess(this.props.society, this.props.user))
        .map(route => ({
          name: route.label,
          href: route.query
            ? `${route.href}?${route.query}`
            : route.href,
        }))}
    />;
  }

  render() {
    return <div className="homepage">
      <div className="content">
        <Head
          society={this.props.society}
          type={Head.HeadTypes.EDWIN}
        />
      </div>
      <div className="columns content">
        {this._renderGroup(EdwinLinks.operations)}
        {this._renderGroup(EdwinLinks.operators)}
        {this._renderGroup(EdwinLinks.monitoring)}
      </div>
      {this._renderDocs()}
    </div>;
  }
}
Homepage.displayName = "Homepage";
Homepage.propTypes = {
  society: PropTypes.object,
  user: PropTypes.object.isRequired,
};
Homepage.defaultProps = {society: undefined};

module.exports = Homepage;

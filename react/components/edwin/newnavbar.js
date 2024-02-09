const React = require("react");

const NewBaseNavbar = require("../newbasenavbar.js");
const Links = require("../../../express/constants/links.js");

class NewNavbar extends React.Component {
  static _renderCopyright() {
    return <div className="has-text-centered is-size-7 mb-2">
      <p>Copyright <a href="#" className="has-text-white">Modélisme LGC92</a> {new Date().getFullYear()}</p>
    </div>;
  }

  constructor(props) {
    super(props);

    this.base = "/";

    this._handleScrollBarOpen = this._handleScrollBarOpen.bind(this);

    this.state = {opened: false};
  }

  _handleScrollBarOpen() {
    this.setState(prevstate => ({opened: !prevstate.opened}));
  }

  // eslint-disable-next-line class-methods-use-this
  _renderBrandContent() {
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  _renderModule(edwinModule) {
    const actions = edwinModule.routes.reduce((acc, route) => {
      const href = route.query
        ? `${route.href}?${route.query}`
        : `${route.href}`;
      acc.push({
        name: route.label,
        href,
      });
      return acc;
    }, []);
    if (!actions.length) return null;

    const img = edwinModule.logo;
    const title = edwinModule.label;

    return <div key={`menu-label-${title}`}>
      <p className="menu-label">
        {img && <img src={img} alt="image" />}
        {title}
      </p>
      <ul className={"menu-list marged"}>
        {actions.map(action => <li
          key={`${title}-${action.name}`}
          className={`action${action.disabled ? " disabled" : ""}`}
        >
          <a href={action.disabled ? null : action.href}>{action.name}</a>
        </li>)}
      </ul>
    </div>;
  }

  _renderHead() {
    const logo = "/images/logo_light.png";

    return <a href={this.base}>
      <figure>
        <img className="logo ml-4 mt-5 mb-4" src={logo} alt="logo" />
      </figure>
    </a>;
  }

  render() {
    return (<div>
      <NewBaseNavbar
        base={this.base}
        brandContent={this._renderBrandContent()}
        hasScrollBar
        scrollBarOpened={this.state.opened}
        scrollBarOnClick={this._handleScrollBarOpen}
        hrefLogout="/society/logout"
        defaultLogo="/images/small_logo_light.png"
      />

      <div className={this.state.opened ? "scrollbar opened" : "scrollbar"}>
        {this._renderHead()}
        <aside className="menu">
          {this._renderModule(Links.piste)}
          {this._renderModule(Links.session)}
        </aside>
        <div className="bottom">
          {NewNavbar._renderCopyright()}
        </div>
      </div>
    </div>);
  }
}
NewNavbar.displayName = "NewNavbar";

module.exports = NewNavbar;

const React = require("react");

const {preventDefault} = require("../../utils/html.js");

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {query: ""};

    this.onInputChange = this.onInputChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.searchRef = React.createRef();
  }

  onInputChange(evt) {
    preventDefault(evt);
    this.setState({query: evt.target.value});
  }

  onKeyPress(evt) {
    if (evt.key === "Enter") {
      this.searchRef.current.click();
    }
  }

  render() {
    return <form className="search">
      <div className="field">
        <div className="control has-icons-right">
          <input
            className="input"
            type="text"
            placeholder="Rechercher une opération"
            value={this.state.query}
            onChange={this.onInputChange}
            onKeyPress={this.onKeyPress}
          />
          <a
            ref={this.searchRef}
            className="icon is-small is-right"
            href={`/society/dashboard?search=${this.state.query}`}
          >
            <i className="fa fa-search" />
          </a>
        </div>
      </div>
    </form>;
  }
}
Search.displayName = "Search";

module.exports = Search;

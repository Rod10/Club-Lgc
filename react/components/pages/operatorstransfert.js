const axios = require("axios");
const React = require("react");
const PropTypes = require("prop-types");

const Civilities = require("../../../express/constants/civilities.js");
const FunctionsFull = require("../../../express/constants/functionsfull.js");
const PlanTypes = require("../../../express/constants/plantypesfull.js");

const Button = require("../bulma/button.js");
const Input = require("../bulma/input.js");
const Select = require("../bulma/select.js");
const Table = require("../bulma/table.js");
const Title = require("../bulma/title.js");

const ContributorTransferModal = require("../contributortransfermodal.js");
const SocietySelect = require("../societyselect.js");
const {OK} = require("../../../express/utils/error.js");

class OperatorsTransfert extends React.Component {
  static getFilterColumns(Functions) {
    return [
      {key: "code", label: "Code"},
      {key: "name", label: "Nom"},
      {
        key: "function",
        label: "Fonction",
        options: Functions.reduce((acc, cur) => {
          acc.push({
            value: cur,
            label: FunctionsFull[cur].name,
          });
          return acc;
        }, [{value: "", label: "Tout"}]),
      },
      {key: "service", label: "Service"},
      {key: "entity", label: "Société / Entité"},
      {
        key: "transfered",
        label: "Transféré",
        options: [
          {value: "owned", label: "Tous"},
          {value: "lent", label: "Prêté(s)"},
          {value: "false", label: "Non"},
        ],
      },
    ];
  }

  static getColumns(context) {
    return [
      {
        className: "checkbox-column",
        key: "check",
        label: "",
        render: context._renderCheckbox.bind(context),
      },
      {key: "code", label: "Code"},
      {
        key: "civility",
        label: "Civilité",
        render: row => Civilities[row.civility].short,
      },
      {key: "lastName", label: "Nom"},
      {key: "firstName", label: "Prénom"},
      {key: "service", label: "Service"},
      {key: "entity", label: "Entité"},
      {
        key: "transferedTo",
        label: "Transféré",
        render: row => row.transferedTo
          ? `${row.transferedTo.city} - ${row.transferedTo.zipcode}`
          : "",
      },
    ];
  }

  constructor(props) {
    super(props);

    const Functions = props.society && PlanTypes[props.society.subscription.planType].functions
      ? PlanTypes[props.society.subscription.planType].functions
      : Object.keys(FunctionsFull);

    this.filterColumns = OperatorsTransfert.getFilterColumns(Functions);

    this.columns = OperatorsTransfert.getColumns(this);

    this.state = {
      qId: 0,
      hasChange: false,
      pending: true,
      count: 0,
      page: 0,
      limit: 100,
      rows: [],
      selected: [],
      showModal: false,
      transfered: "owned",
    };

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleTargetSocietyChange = this.handleTargetSocietyChange.bind(this);
    this.handleOpenTransferModal = this.handleOpenTransferModal.bind(this);
    this.handleConfirmTransfer = this.handleConfirmTransfer.bind(this);
    this.handleCloseTransferModal = this.handleCloseTransferModal.bind(this);
    this.rowClassFn = this.rowClassFn.bind(this);
  }

  componentDidMount() {
    this.initSearch();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.pending && this.state.hasChange && !prevState.hasChange) {
      this.initSearch();
    }
    if (this.state.qId !== prevState.qId) {
      this.doSearch();
    }
  }

  initSearch() {
    this.setState(prevState => ({
      qId: prevState.qId + 1,
      pending: true,
      hasChange: false,
    }));
  }

  doSearch() {
    const search = new URLSearchParams({
      qId: this.state.qId,
      page: this.state.page,
      limit: this.state.limit,
      state: "ACTIVE",
    });
    this.filterColumns.forEach(filter => {
      if (this.state[filter.key]) {
        search.set(filter.key, this.state[filter.key]);
      }
    });
    axios.get(`/society/api/search-contributors?${search.toString()}`)
      .then(result => {
        if (result.status === OK) {
          this.setState({
            count: result.data.count,
            rows: result.data.rows,
            hasChange: false,
            pending: false,
          });
        } else {
          this.setState({
            hasChange: false,
            pending: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          hasChange: false,
          pending: false,
        });
      });
  }

  handleCheckboxChange(evt) {
    const contributorId = parseInt(evt.target.dataset.contributorid, 10);
    if (evt.target.checked) {
      this.setState(prevState => ({selected: prevState.selected.concat(contributorId)}));
    } else {
      this.setState(prevState => ({selected: prevState.selected.filter(e => e !== contributorId)}));
    }
  }

  handleFilterChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
      hasChange: true,
    });
  }

  handleTargetSocietyChange(evt, targetSociety) {
    this.setState({targetSociety});
  }

  handleOpenTransferModal() {
    this.setState({showModal: true});
  }

  handleConfirmTransfer() {
    this.setState({
      hasChange: true,
      selected: [],
      showModal: false,
    });
  }

  handleCloseTransferModal() {
    this.setState({showModal: false});
  }

  rowClassFn(row) {
    if (!row.transferedToSocietyId) {
      return "";
    } else if (row.transferedToSocietyId === this.props.society.id) {
      return "opReceived";
    }
    return "opLent";
  }

  _renderNavigationLeft() {
    return <>
      <div
        className="list-legend opLent"
        title="L'opérateur a été transféré dans une autre entité, il ne peut pas être utilisé dans les opérations"
      >Prêté(s)</div>
      {this.state.selected.length > 0 && <div className="legend-transfer">
        <div>{`Transférer ${this.state.selected.length} opérateur(s) vers`}</div>
        <SocietySelect
          fieldClassName="no-bottom-margin"
          name="targetSociety"
          noLabel
          horizontal
          onChange={this.handleTargetSocietyChange}
          society={this.props.society}
        />
        <Button
          label="Transférer"
          onClick={this.handleOpenTransferModal}
          type="themed"
          disabled={!this.state.targetSociety}
        />
      </div>}
    </>;
  }

  _renderCheckbox(row) {
    return <input
      type="checkbox"
      value="checked"
      data-contributorid={row.id}
      checked={this.state.selected.includes(row.id)}
      onChange={this.handleCheckboxChange}
    />;
  }

  _renderFilters() {
    return <div className="filters">
      {this.filterColumns.map(filter => {
        const props = {
          key: `filter-${filter.key}`,
          label: filter.label,
          name: filter.key,
          value: this.state[filter.key],
          onChange: this.handleFilterChange,
        };
        if (filter.options) {
          props.options = filter.options;
          return <Select key={props.key} {...props} />;
        }
        return <Input key={props.key} {...props} debouncing />;
      })}
    </div>;
  }

  render() {
    return <div className="container is-fluid">
      <Title
        centered
        color="themed"
      >Gestion du prêt des opérateurs</Title>
      {this._renderFilters()}
      <Table
        columns={this.columns}
        count={this.state.count}
        onChange={this.handleFilterChange}
        navigationLeft={this._renderNavigationLeft()}
        limit={this.state.limit}
        name="operatorList"
        page={this.state.page}
        rowClassFn={this.rowClassFn}
        rows={this.state.rows}
        tableClassName="operator-list"
      />
      <ContributorTransferModal
        contributors={this.state.selected}
        targetSociety={this.state.targetSociety}
        visible={this.state.showModal}
        onConfirm={this.handleConfirmTransfer}
        onClose={this.handleCloseTransferModal}
      />
    </div>;
  }
}
OperatorsTransfert.displayName = "OperatorsTransfert";
OperatorsTransfert.propTypes = {society: PropTypes.object};
OperatorsTransfert.defaultProps = {society: undefined};

module.exports = OperatorsTransfert;

const React = require("react");
const PropTypes = require("prop-types");
const df = require("dateformat");

const {
  Chart, CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  registerables,
} = require("chart.js");
const Title = require("../bulma/title.js");
const Columns = require("../bulma/columns.js");
const Column = require("../bulma/column.js");
const {getElFromDataset} = require("../../utils/html");
const {durationToMs, msToDuration} = require("../../../express/services/utils.js");
const carColors = require("../../../express/constants/carcolors.js").carColors;

class Homepage extends React.Component {
  constructor(props) {
    super(props);

    const piste = props.piste ? props.piste : {
      path: "",
      tours: 0,
    };

    const session = props.session ? props.session : {tours: 0};
    const bestSession = props.bestSession ? props.bestSession : {tours: 0};

    this.state = {
      piste,
      session,
      bestSession,
      selectedCar: null,
    };
    this.charts = {};
    if (this.props.graphs) {
      Object.keys(this.props.graphs).forEach(graphKey => {
        const graph = this.props.graphs[graphKey];
        this.charts[graph.label] = React.createRef();
      });
    }
    this.handleCarSelect = this.handleCarSelect.bind(this);
  }

  componentDidMount() {
    Chart.register(CategoryScale);
    Chart.register(LinearScale);
    Chart.register(BarController);
    Chart.register(BarElement);
    Chart.register(...registerables);

    if (this.props.graphs) {
      Object.keys(this.props.graphs).forEach(graphKey => {
        const graph = this.props.graphs[graphKey];
        if (graph.type === "pie") {
          this.createPieChart(graph, this.charts[graph.label].current.getContext("2d"));
        } else {
          this.createLineChart(graph, this.charts[graph.label].current.getContext("2d"));
        }
      });
    }
  }

  handleCarSelect(evt) {
    const el = getElFromDataset(evt, "car");
    const car = parseInt(el.dataset.car, 10);
    this.setState({selectedCar: car});
  }

  createPieChart(graph, chart) {
    this.context = chart;
    const {label, labels, backgroundColor} = graph;
    const data = {
      labels,
      datasets: [{
        label,
        data: graph.data,
        backgroundColor,
        hoverOffset: 4,
      }],
    };
    new Chart(this.context.canvas, {
      type: "pie",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
      },
    });
  }

  createLineChart(graph, chart) {
    this.context = chart;
    const {type, data, options} = graph;
    new Chart(this.context.canvas, {
      type,
      data,
      options,
    });
  }

    /* eslint-disable indent */
    _renderNotif() {
        const {notifs} = this.props;
        return <div className="content">

          {notifs && notifs.length > 0
                ? notifs.map(notif => <div
                    className={"graph-box mb-2"}
                    key={notif.body}
                >
                  <b>
                    {notif.body}
                    {this.props.page === "track" && <a
                      href={`/session/${notif.id}/view`}
                      rel="noreferrer"
                      title="Visualiser"
                    >
                      <span className="icon"><i className="fa fa-eye" /></span>
                    </a>}
                    {this.props.page === "session" && <a
                      rel="noreferrer"
                      title="Selectionner"
                      data-car={notif.carId}
                      onClick={this.handleCarSelect}
                    >
                      <span className="icon"><i className="fa fa-eye" /></span>
                    </a>}
                  </b>
                  {
                        notif.text && notif.text.length > 0
                        && <ul>
                            {
                              <li key={notif.text}>
                                {notif.text}
                              </li>
                            }
                        </ul>
                    }
                </div>)
                : <p>🎉 Vous n'avez aucune session sur cette piste 🌴</p>}
        </div>;
    }

    _renderTableBody() {
      const {session, selectedCar} = this.state;
      let laps;
      let transponder;
      let pilot;
      let fastestLap = [];
      if (selectedCar) {
        const data = session.data.find(t => t.Id === parseInt(selectedCar, 10));
        laps = data.laps;
        if (laps.length >= 1) {
          transponder = data.DisplayName;
          pilot = data.Pilot.Nickname;
          fastestLap.push(laps.map(lap => ({
            id: lap.Id,
            duration: durationToMs(lap.Duration),
          }))
            .sort((a, b) => a.duration - b.duration)[0].id);
        }
      } else {
        laps = session.laps;
        for (const t of session.data) {
        if (t.laps.length >= 1) {
          fastestLap.push(t.laps.map(lap => ({
            id: lap.Id,
            duration: durationToMs(lap.Duration),
          }))
            .sort((a, b) => a.duration - b.duration)[0].id);
          }
        }
      }
      return laps.length >= 1 && laps.map((lap, index) => <tr key={lap.Id} style={{backgroundColor: fastestLap.includes(lap.Id) ? carColors[session.data.find(t => t.Id === lap.TransponderId).Uid] : ""}}>
        <td>{lap.Number}</td>
        <td>{transponder || session.data.find(t => t.Id === lap.TransponderId).DisplayName}</td>
        <td>{pilot || session.data.find(t => t.Id === lap.TransponderId).Pilot.Nickname}</td>
        <td>{lap.Duration}</td>
      </tr>);
    }

    _renderTimeTable() {
      return <table className="table is-bordered is-fullwidth">
        <thead>
          <tr>
            <th>N° Tour</th>
            <th>Voiture</th>
            <th>Pilote</th>
            <th>Temps</th>
          </tr>
        </thead>
        <tbody>
          {this._renderTableBody()}
        </tbody>
      </table>;
    }

  render() {
    const {bestSession, piste, session} = this.state;
    const allLapsGraph = this.props.graphs["allLaps"];
    const title = this.props.page === "session" ? `Session du: ${df(new Date(session.date), "dd/mm/yyyy")}` : "Toute les sessions de cette piste";
    return <div className="body-content">
      <Title centered size={2}>{title}</Title>
      <br />
      <Columns>
        <Column size={Column.Sizes.oneThird}>
          <div className="box" style={{height: "540.05px"}}>
            <img src={piste.path} alt="Image de la piste" />
            <Columns>
              <Column size={Column.Sizes.half}>
                <div>
                  <p>Nombres de dalles: {piste.dalles}</p>
                </div>
              </Column>
              <Column size={Column.Sizes.half}>
                <div>
                  <p>Nombres de tours effectuer: {piste.tours}</p>
                </div>
              </Column>
            </Columns>
          </div>
        </Column>
        <Column size={Column.Sizes.oneThird}>
          <div className="box">
            <Title centered size={4}>Résumé</Title>
            <Columns>
              <Column size={Column.Sizes.half}>Nombre de tours: {session.totalLaps}</Column>
              <Column size={Column.Sizes.half}>Temps total: {session.normal.totalDrivingTime}</Column>
            </Columns>
            <Columns className="is-centered">
              <Column size={Column.Sizes.half}>Temps moyen: {session.normal.averageLap}</Column>
            </Columns>
          </div>
          <div className="box">
            <Title centered size={4}>Meilleur Tour</Title>
            <Columns>
              <Column size={Column.Sizes.half}>Voiture: {session.best.transponder.DisplayName}</Column>
              <Column size={Column.Sizes.half}>Pilote: {session.best.transponder.Pilot.Nickname}</Column>
            </Columns>
            <Columns>
              <Column size={Column.Sizes.half}>Tour: {session.best.lap.Number}</Column>
              <Column size={Column.Sizes.half}>Temps: {session.best.lap.Duration}</Column>
            </Columns>
          </div>
          <div className="box">
            <Title centered size={5}>Meilleur Session: {df(new Date(bestSession.date), "dd/mm/yyyy")}</Title>
            <Columns>
              <Column size={Column.Sizes.half}>Nombre de tours: {bestSession.totalLaps}</Column>
              <Column size={Column.Sizes.half}>Temps total: {bestSession.normal.totalDrivingTime}</Column>
            </Columns>
            <Columns>
              <Column size={Column.Sizes.half}>Voiture: {bestSession.best.transponder.DisplayName}</Column>
              <Column size={Column.Sizes.half}>Pilote: {bestSession.best.transponder.Pilot.Nickname}</Column>
            </Columns>
            <Columns>
              <Column size={Column.Sizes.half}>Tour: {bestSession.best.lap.Number}</Column>
              <Column size={Column.Sizes.half}>Temps: {bestSession.best.lap.Duration}</Column>
            </Columns>
          </div>
        </Column>
        <Column size={Column.Sizes.oneThird}>
          <div className="box">
            <div
              key={allLapsGraph.label}
              className={`is-${allLapsGraph.column} is-flex-grow-${allLapsGraph.column}`}
            >
              <div className="pr-2 pb-2">
                <div className={"allLapsGraph-box"}>
                  <Title size={5}>{allLapsGraph.label}</Title>
                  <div className="is-relative" style={{height: "454px", width: "454px"}}>
                    <canvas id="chart" ref={this.charts[allLapsGraph.label]} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Column>
      </Columns>
      <Columns>
        <Column size={Column.Sizes.oneThird}>
          <div className="box" style={{height: "540.5px", overflowX: "hidden", overflowY: "auto"}}>
            <article className="tile is-child">
              {this._renderNotif()}
            </article>
          </div>
        </Column>
        {this.props.page === "session" && <Column size={Column.Sizes.oneThird}>
          <div className="box" style={{height: "540.5px", overflowX: "hidden", overflowY: "auto"}}>
            <article className="tile is-child box">
              {this._renderTimeTable()}
            </article>
          </div>
          </Column>}
      </Columns>
    </div>;
  }
}

Homepage.displayName = "Homepage";
Homepage.propTypes = {
  page: PropTypes.string.isRequired,
  piste: PropTypes.object,
  session: PropTypes.object,
  notifs: PropTypes.array,
  graphs: PropTypes.object,
};
Homepage.defaultProps = {
  piste: undefined,
  session: undefined,
  notifs: undefined,
  graphs: undefined,
};
module.exports = Homepage;



const { REACT_APP_BACKEND_URL } = process.env;

import Paper from "@material-ui/core/Paper";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Admin from "./admin/Admin.js";
import Footer from "./components/Footer.js";
import Header from "./components/Header.js";
import UserMain from "./user/UserMain.js";
import Lottie from "react-lottie";
import lottieLoanding from "./assets/lotties/loanding.json";

//PRUEBA

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      socket: null,
      isJoined: false,
      isWaiting: false,
      isEnd: false,
      isDeleted: false,
      actualFigure: "",
      figureIndex: 1,
      gameUuid: "",
    };
  }

  timeout = 250; // Initial timeout duration as a class variable

  /**
   * @function connect
   * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
   */
  connect = () => {
    


    var socket = new WebSocket("wss://"+REACT_APP_BACKEND_URL+":8090/vibration/websocket");

    let that = this; // cache the this
    var connectInterval;

    // websocket onopen event listener
    socket.onopen = () => {
      console.log("connected websocket main component");

      this.setState({ socket: socket });
      that.timeout = 250; // reset timer to 250 on open of websocket connection
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    };

    // websocket onclose event listener
    socket.onclose = (e) => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (that.timeout + that.timeout) / 1000
        )} second.`,
        e.reason
      );

      that.timeout = that.timeout + that.timeout; //increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    };

    // websocket onerror event listener
    socket.onerror = (err) => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );

      socket.close();
    };

    socket.onmessage = (e) => {
      console.log("message", e.data);

      var obj = JSON.parse(e.data);

      if (obj.username !== undefined) {
        this.setState({ name: obj.username });
      }

      if (obj.state !== undefined) {
        if (obj.state === "CONNECTED") {
          if (obj.message === "GAME DELETED") {
            this.setState({ isDeleted: true });
          }
        }

        if (obj.state === "JOINED") {
          this.setState({ gameUuid: obj.gameUuid });
          this.setState({ isJoined: true });
        }

        if (obj.state === "WAITING") {
          this.setState({ isWaiting: true });
        }
        if (obj.state === "PLAYING") {
          if (this.state.figureIndex === 1) {
            if (obj.figure !== undefined) {
              if (obj.correct === true) {
                //FIGURA CORRECTA
                this.setState({ figureIndex: this.state.figureIndex + 1 });
              }
              this.setState({ actualFigure: obj.figure }); //FIRST TIME FIGURE
            }
          }
          if ((obj.message = "FIGURE REVIEWED")) {

            console.log(obj.message);
            if (obj.correct === true) {
              this.setState({
                figureIndex: this.state.figureIndex + 1,
              });
              this.setState({ actualFigure: obj.figure });
              console.log("NEW FIGURE");
              console.log(obj.figure);
            }
          }
        }
        if (obj.state === "END") {
          console.log("Game ended!");
          this.setState({ isEnd: true });
        }
      }
    };
  };

  componentDidMount() {
    var isAdmin = window.location.href.includes("admin");
    if (!isAdmin) {
      this.connect();
    
      var url = "https://"+REACT_APP_BACKEND_URL+":8090/game/list" ;
      fetch(url)
        .then((response) => response.json())
        .then((rankingScore) =>
          console.log(rankingScore)
        ).catch(function() {
          console.log("error");
      });
      this.setState({ isRankingLoad: true });
    } else {
      this.setState({ name: "admin" });
    }
  }

  render() {
  

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: lottieLoanding,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    if (this.state.name === "") {
      return (
        <div>
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      );
    } else {
      return (
        <Router>
          <div>
            <header className="App-header">
              <Header />
            </header>
            <Switch>
              <Route path="/admin">
                <Admin />
              </Route>
              <Route path="/">
                <UserMain
                  randomName={this.state.name}
                  socket={this.state.socket}
                  isJoined={this.state.isJoined}
                  isWaiting={this.state.isWaiting}
                  actualFigure={this.state.actualFigure}
                  figureIndex={this.state.figureIndex}
                  isDeleted={this.state.isDeleted}
                  isEnd={this.state.isEnd}
                  gameUuid={this.state.gameUuid}
                />
              </Route>
            </Switch>
            <Paper>
              <Footer />
            </Paper>
          </div>
        </Router>
      );
    }
  }
}

export default App;

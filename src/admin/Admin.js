
const { REACT_APP_BACKEND_URL } = process.env;

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import React from "react";
import CreateGame from "./CreateGame.js";

import StartDeleteGame from "./StartDeleteGame.js";

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreated: false,
      socket: [],
      maxPlayers: 5,
      victoryConditions: 1,
      gameList: [],
      gameStart: "",
      open: false,
      gameCreatedUuid: null,
      isFinished: false,
    };
  }

  componentDidMount() {
    var sock = new WebSocket("wss://"+REACT_APP_BACKEND_URL+":8090/vibration/websocket");

    this.setState({ socket: sock });

    sock.onopen = function () {
      console.log("open");
    };

    sock.onerror = (e) => {
      console.log("ERROR:");
      console.log(e);
    };

    sock.onmessage = (e) => {
      console.log("message", e.data);

      var messageResponse = JSON.parse(e.data);
      var message = messageResponse.message;
      if (message === "GAME CREATED") {
        this.setState({
          isCreated: true,
          open: true,
          gameCreatedUuid: messageResponse.uuid,
        });
      }

      if (messageResponse.state === "END") {
        this.setState({
          isFinished: true,
        });
      }

      //sock.close();
    };
  }

  handleChange = (event, state) => {
    this.setState({
      [state]: event.target.value,
    });
  };

  render() {
    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }

      this.setState({ open: false });
    };

    const { classes } = this.props;

    if (!this.state.isCreated) {
      return (
        <div className="App">
          <Paper style={{ borderRadius: "25px" }} elevation={3}>
            <Grid
              container
              spacing={4}
              direction="column"
              justify="center"
              alignItems="center"
            >
              <h1>Administrator Page</h1>
              <CreateGame socket={this.state.socket} />
              <br />
              <br />
            </Grid>
          </Paper>
          <br />
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <div className="App">
            <Paper style={{ borderRadius: "25px" }} elevation={3}>
              <Grid
                container
                spacing={4}
                direction="column"
                justify="center"
                alignItems="center"
              >
                <h1>Administrator Page</h1>

                <StartDeleteGame
                  socket={this.state.socket}
                  gameCreatedUuid={this.state.gameCreatedUuid}
                  isFinished={this.state.isFinished}
                />
                <br />
                <br />

                <Snackbar
                  open={this.state.open}
                  autoHideDuration={3000}
                  onClose={handleClose}
                >
                  <Alert onClose={handleClose} severity="success">
                    Game created succesfully!
                  </Alert>
                </Snackbar>

                <br />
              </Grid>
            </Paper>
            <br />
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(Admin);

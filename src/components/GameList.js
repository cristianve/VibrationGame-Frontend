const { REACT_APP_BACKEND_URL } = process.env;


import React from "react";

import { withStyles } from "@material-ui/core/styles";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Lottie from "react-lottie";
import lottieSearch from "../assets/lotties/search.json";
import lottieJoin from "../assets/lotties/join.json";
import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
});

class GameList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGame: false,
      gameList: [],
      delay: 3000,
      socket: [],
    };
  }

  componentDidMount() {
    this.setState({ socket: this.props.socket });
    this.interval = setInterval(this.updateFetch, this.state.delay);

    fetch("https://"+REACT_APP_BACKEND_URL+":8090/game/list")
      .then((response) => response.json())
      .then((gameList) => this.setState({ gameList: gameList.gameList }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.delay !== this.state.delay) {
      clearInterval(this.interval);
      this.interval = setInterval(this.updateFetch, this.state.delay);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateFetch = () => {
    console.log("update");
    fetch("https://"+REACT_APP_BACKEND_URL+":8090/game/list")
      .then((response) => response.json())
      .then((gameList) => this.setState({ gameList: gameList.gameList }));
  };

  joinGame = (event, id, socket) => {
    this.setState({ gameUuuid: id });

    console.log("Trying send gameuuid:" + id);

    socket.send(
      JSON.stringify({
        action: "JOIN",
        gameId: id,
      })
    );
  };

  render() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: lottieSearch,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    const defaultOptionsJoin = {
      loop: true,
      autoplay: true,
      animationData: lottieJoin,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
    const { classes } = this.props;

    if (this.state.gameList.length === 0) {
      return (
        <div>
          <Typography style={{ marginTop: "28px" }} component={"span"}>
            <Box fontWeight="fontWeightBold" fontSize={21}>
              Searching game...🔍
            </Box>
          </Typography>

          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <Lottie options={defaultOptionsJoin} height={200} width={200} />
          {this.state.gameList.map((game, i) => {
            if (game.playing === true) {
              return (
                <div key={"gameplaying" + i}>
                  <Grid
                    container
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing={3}
                  >
                    <Grid item xs={6}>
                      <TextField
                        style={{ marginLeft: "24px" }}
                        disabled
                        id={"outlined-disabled" + i}
                        label="Game name"
                        defaultValue={game.name}
                        variant="outlined"
                        key={"outlined-disabled" + i}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <Button
                        disabled
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        endIcon={<DirectionsRunIcon />}
                        key={"contained" + i}
                      >
                        Started
                      </Button>
                    </Grid>
                  </Grid>

                  <br />
                  <br />
                </div>
              );
            } else {
              return (
                <div key={"div" + i}>
                  <Grid
                    container
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing={3}
                  >
                    <Grid item xs={6}>
                      <TextField
                        disabled
                        style={{ marginLeft: "24px" }}
                        id={"outlined-disabled" + i}
                        label="Game name"
                        defaultValue={game.name}
                        variant="outlined"
                        key={"outlined-disabled" + i}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        onClick={(e) =>
                          this.joinGame(e, game.id, this.props.socket)
                        }
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        endIcon={<SportsEsportsIcon />}
                        key={"contained" + i}
                      >
                        Join
                      </Button>
                    </Grid>
                  </Grid>

                  <br />
                  <br />
                </div>
              );
            }
          })}
        </div>
      );
    }
  }
}

export default withStyles(styles)(GameList);

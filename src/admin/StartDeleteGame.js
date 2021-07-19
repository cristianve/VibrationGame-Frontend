
const { REACT_APP_BACKEND_URL } = process.env;

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import DeleteIcon from "@material-ui/icons/Delete";
import ReplayIcon from "@material-ui/icons/Replay";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Lottie from "react-lottie";
import lottieWaiting from "../assets/lotties/waiting.json";

import React from "react";

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

class StartGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGameStarted: false,
      gameCreatedUuid: null,
      playersWaiting: [],
      ranking: [],
      delay: 3000,
      isGameEnded: false,
    };
  }

  componentDidMount() {
    this.setState({ gameCreatedUuid: this.props.gameCreatedUuid });
    this.interval = setInterval(this.updateFetch, this.state.delay);
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

  startGame = (event, socket) => {
    //event.preventDefault();

    socket.send(
      JSON.stringify({
        action: "START",
      })
    );

    this.setState({ isGameStarted: true });
  };

  gameStatus = (isFinished) => {
    if (isFinished) {
      return (
        <Typography component={"span"}>
          <Box fontSize={21}>Finished</Box>
        </Typography>
      );
    } else {
      return (
        <Typography component={"span"}>
          <Box fontSize={21}>Playing</Box>
        </Typography>
      );
    }
  };

  createNewGame = (isFinished, classes) => {
    if (isFinished) {
      return (
        <Button
          onClick={() => window.location.reload()}
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          startIcon={<ReplayIcon />}
        >
          Create new game!
        </Button>
      );
    }
  };

  deleteGame = (event, socket) => {
    //event.preventDefault();

    socket.send(
      JSON.stringify({
        action: "DELETE",
      })
    );

    window.location.reload();
  };

  updateRanking = (isFinished) => {
    if (!isFinished) {
      var url = "https://"+REACT_APP_BACKEND_URL+":8090/ranking/game/" + this.state.gameCreatedUuid;
      fetch(url)
        .then((response) => response.json())
        .then((rankingScore) =>
          this.setState({ ranking: rankingScore.ranking })
        );
    } else if (!this.state.isGameEnded && isFinished) {
      this.setState({ isGameEnded: true });
      this.props.socket.close();
    }
  };

  updateFetch = () => {
    this.updateRanking(this.props.isFinished);
    fetch("https://"+REACT_APP_BACKEND_URL+":8090/game/players/" + this.state.gameCreatedUuid)
      .then((response) => response.json())
      .then((playersWaiting) =>
        this.setState({ playersWaiting: playersWaiting.playerList })
      );
  };

  render() {
    const { classes } = this.props;

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: lottieWaiting,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    if (!this.state.isGameStarted) {
      return (
        <div>
          <Paper className={classes.paper}>
            <h3>Players Joined:</h3>
            {this.state.playersWaiting.map((player, i) => {
              return (
                <div key={"playerWaiting" + i}>
                  <TextField
                    disabled
                    id="outlined-player-disabled"
                    label={"Player name"}
                    defaultValue={player.username}
                    variant="outlined"
                    key={"outlined-player-disabled" + i}
                  />
                  <br />
                  <br />
                </div>
              );
            })}

            <Button
              onClick={(e) => this.startGame(e, this.props.socket)}
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<PlayCircleFilledIcon />}
            >
              Start Game
            </Button>
            <br />
            <br />
            <Button
              onClick={(e) => this.deleteGame(e, this.props.socket)}
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<DeleteIcon />}
            >
              Delete Game
            </Button>
          </Paper>
        </div>
      );
    } else if (
      this.state.playersWaiting.length === 0 &&
      !this.state.isGameEnded
    ) {
      return (
        <div>
          <Typography component={"span"} style={{ marginTop: "24px" }}>
            <Box fontWeight="fontWeightBold" fontSize={21}>
              No people available
            </Box>
          </Typography>
          <Lottie options={defaultOptions} height={200} width={200} />
          <br />
          <br />
          <Button
            onClick={() => window.location.reload()}
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            startIcon={<ReplayIcon />}
          >
            Create new game!
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <Grid
            container
            spacing={4}
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={12} style={{ marginTop: "12px" }}>
              <Typography component={"span"}>
                <Box fontWeight="fontWeightBold" fontSize={21}>
                  Game Status:
                </Box>
              </Typography>
            </Grid>

            {this.gameStatus(this.props.isFinished)}

            <Grid item xs={12}>
              <Typography component={"span"}>
                <Box fontWeight="fontWeightBold" fontSize={21}>
                  Show Ranking:
                </Box>
              </Typography>
            </Grid>

    

            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Username</TableCell>
                      <TableCell align="center">Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(this.state.ranking).map((player, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell align="center">{player[0]}</TableCell>
                          <TableCell align="center">{player[1]}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <br />
            {this.createNewGame(this.props.isFinished, classes)}
          </Grid>
        </div>
      );
    }
  }
}

export default withStyles(styles)(StartGame);

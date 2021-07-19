import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import React from "react";
import NicknameBoard from "../components/NicknameBoard";
import { withStyles } from "@material-ui/core/styles";
import GameList from "../components/GameList";

//import ButtonPlay from "./components/ButtonPlay.js";
import Lottie from "react-lottie";
import lottieWelcome from "../assets/lotties/welcome.json";
import FigureManager from "../components/slides/FigureManager.js";

const styles = (theme) => ({
  buttonPlay: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
  },
});

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    //const { classes } = this.props;

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: lottieWelcome,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    if (this.props.isJoined) {
      return (
        <div>
          <FigureManager
            socket={this.props.socket}
            isJoined={this.props.isJoined}
            isWaiting={this.props.isWaiting}
            isEnd={this.props.isEnd}
            isDeleted={this.props.isDeleted}
            actualFigure={this.props.actualFigure}
            figureCorrect={this.props.figureCorrect}
            figureReviewed={this.props.figureReviewed}
            figureIndex={this.props.figureIndex}
            gameUuid={this.props.gameUuid}
          />
        </div>
      );
    } else {
      return (
        <div>
          <Paper style={{ borderRadius: "25px" }} elevation={3}>
            <Grid
              container
              spacing={4}
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <Lottie options={defaultOptions} height={100} width={300} />
                <NicknameBoard randomName={this.props.randomName} />
              </Grid>
            </Grid>
          </Paper>
          <br />
          <br />
          <Paper style={{ borderRadius: "25px" }} elevation={3}>
            <Grid
              container
              spacing={4}
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <GameList socket={this.props.socket} />
              </Grid>
            </Grid>
          </Paper>
          <br />
        </div>
      );
    }
  }
}

export default withStyles(styles)(Main);

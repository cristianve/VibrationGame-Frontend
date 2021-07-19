
const { REACT_APP_BACKEND_URL } = process.env;

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import HomeIcon from "@material-ui/icons/Home";
import React from "react";
import RightPattern from "./Figures/RightPattern";
import LeftPattern from "./Figures/LeftPattern";
import DownPattern from "./Figures/DownPattern";
import UpPattern from "./Figures/UpPattern";

import CirclePattern from "./Figures/CirclePattern";
import ShakePattern from "./Figures/ShakePattern";

import Lottie from "react-lottie";
import lottieRocket from "../../assets/lotties/rocket.json";
import lottiePleaseWait from "../../assets/lotties/pleaseWait.json";
import lottieFinish from "../../assets/lotties/finish.json";
import lottieScore from "../../assets/lotties/score.json";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Loanding from "../Loanding.js";

const styles = (theme) => ({
  appBar: {
    position: "relative",
  },

  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  typography: {
    padding: theme.spacing(2),
  },
});

const steps = ["", "", "", "", "", ""];

function getStepContent(figure) {
  switch (figure) {
    case "MOVE_RIGHT":
      return <RightPattern />;
    case "MOVE_LEFT":
      return <LeftPattern />;
    case "MOVE_UP":
      return <UpPattern />;
    case "MOVE_DOWN":
      return <DownPattern />;
    case "CIRCLE":
      return <CirclePattern />;
    case "SHAKE":
      return <ShakePattern />;
    default:
      return <Loanding />;
  }
}

const numberOfFigures = 5;
const sumatoryMinimum = 15;

//var array = new Array();

class FigureManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      gameUuid: null,
      //Figures
      delay: 3000,
      is_running: false,
      demo_button: document.getElementById("start_demo"),
      figureIndex: 1,
      //Score - Final Ranking
      ranking: [],
      isRankingLoad: false,
      sensorStopped: false,
      valueIndex: 1,
      valuesArray: new Array(5),
      isMoving: false,
      isReviwing: false,
    };
  }

  componentDidMount() {
    this.setState({ gameUuid: this.props.gameUuid });
  }

  componentWillUnmount() {}

  updateRankig = (gameUuid) => {
    if (!this.state.isRankingLoad) {
      //console.log("https://"+REACT_APP_BACKEND_URL+":8090/ranking/game/" + gameUuid);
      var url = "https://"+REACT_APP_BACKEND_URL+":8090/ranking/game/" + gameUuid;
      fetch(url)
        .then((response) => response.json())
        .then((rankingScore) =>
          this.setState({ ranking: rankingScore.ranking })
        );
      this.setState({ isRankingLoad: true });
    }
  };

  
  handleOrientation(event) {
    if (this.state.is_running) {
      if (event != undefined) {
        this.incrementEventCount(
          event.acceleration.x,
          event.acceleration.y,
          event.acceleration.z
        );
      }

      if (this.state.is_running === true && this.state.activeStep !== 6) {
        if (this.props.figureIndex !== this.state.figureIndex) {
          //Only if is correct fragment next step
          this.setState({ activeStep: this.state.activeStep + 1 });
        }
        this.setState({ figureIndex: this.props.figureIndex });

        var numberOfDecimals = 6;

        if (this.state.isMoving && event !=undefined) {
          var date = new Date();
          var ticks = date.getTime();

          this.props.socket.send(
            JSON.stringify({
              action: "DATA",
              time: ticks, //LONG
              xCoordinates: event.acceleration.x.toFixed(numberOfDecimals),
              yCoordinates: event.acceleration.y.toFixed(numberOfDecimals),
              zCoordinates: event.acceleration.z.toFixed(numberOfDecimals),
            })
          );
        } else if (this.state.isReviwing) {

          //console.log(JSON.stringify(array));
          console.log("Review");
          this.props.socket.send(
            JSON.stringify({
              action: "REVIEW",
            })
          );
          this.setState({ isReviwing: false });
        }
      }
    }
  }

  incrementEventCount(x, y, z) {
    if (this.state.is_running && !this.state.isReviwing) {
      if (this.state.valueIndex == numberOfFigures) {
        this.setState({ valueIndex: 0 });
      }
      const newValuesArray = this.state.valuesArray.slice(); //copy the array
      var temporalSum = Math.abs(x) + Math.abs(y) + Math.abs(z);
      newValuesArray[this.state.valueIndex] = temporalSum; //execute the manipulations
      this.setState({ valuesArray: newValuesArray }); //set the new state
      this.setState({ valueIndex: this.state.valueIndex + 1 });

      var sumatorio = this.state.valuesArray.reduce((a, b) => a + b, 0);

      if (sumatorio > sumatoryMinimum) {
        this.setState({ isMoving: true });
      } else {
        if (this.state.isMoving) {
          this.setState({ isReviwing: true });
        }
        this.setState({ isMoving: false });
      }
    }
  }

  stopSensors() {
    if (!this.state.sensorStopped) {
      this.setState({ is_running: false });
      window.removeEventListener("devicemotion", this.handleOrientation());
      this.setState({ sensorStopped: true });
    }
  }

  updateSensors() {

    // Request permission for iOS 13+ devices
    var deviceMotionEvent = new DeviceMotionEvent({delay:1});

    if (
      deviceMotionEvent &&
      typeof deviceMotionEvent.requestPermission === "function"
    ) {
      deviceMotionEvent.requestPermission();
    }

    if (!this.state.is_running) {
      window.addEventListener(
        "devicemotion",
        (event) => {
          this.handleOrientation(event);
        },
        true
      );
      this.setState({ is_running: true });
    }
  }

  render() {
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      //return (ev.returnValue = "Are you sure you want to close?");
    });

    const { classes } = this.props;

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: lottieRocket,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    const defaultOptionsWait = {
      loop: true,
      autoplay: true,
      animationData: lottiePleaseWait,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    const defaultOptionsFinish = {
      loop: true,
      autoplay: true,
      animationData: lottieFinish,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    const defaultOptionsScore = {
      loop: true,
      autoplay: true,
      animationData: lottieScore,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    if (!this.props.isWaiting) {
      if (this.props.isDeleted) {
        window.location.reload();
      }
      window.scrollTo(0, 0);
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
              <Grid item xs={12} style={{ marginTop: "24px" }}>
                <Typography component={"span"}>
                  <Box fontWeight="fontWeightBold" fontSize={21} m={1}>
                    Waiting for the administrator
                  </Box>
                </Typography>
                <Typography component={"span"}>
                  <Box fontWeight="fontWeightBold" fontSize={21} m={1}>
                    to start the game!
                  </Box>
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Lottie options={defaultOptions} height={150} width={150} />
                <Lottie options={defaultOptionsWait} height={150} width={150} />
              </Grid>
            </Grid>
          </Paper>
          <br />
          <br />
        </div>
      );
    } else if (this.props.isWaiting && !this.props.isEnd) {
      if (!this.state.sensorStopped) {
        this.updateSensors();
      }

      return (
        <React.Fragment>
          <CssBaseline />
          <Paper style={{ borderRadius: "25px" }} elevation={3}>
            <Grid
              container
              spacing={4}
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <Stepper
                  activeStep={this.state.activeStep}
                  className={classes.stepper}
                >
                  {steps.map((label, i) => (
                    <Step key={label + i}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <React.Fragment>
                  {this.state.activeStep === steps.length ? (
                    <React.Fragment>
                      {this.stopSensors()}
                      <Grid
                        container
                        spacing={4}
                        direction="column"
                        justify="center"
                        alignItems="center"
                      >
                        <Grid item xs={12}>
                          <Typography
                            variant="h5"
                            gutterBottom
                            component={"span"}
                          >
                            <Box fontWeight="fontWeightBold" m={1}>
                              Thank for playing!🎉
                            </Box>
                          </Typography>
                          <Lottie
                            options={defaultOptionsFinish}
                            height={150}
                            width={150}
                          />
                          <Typography component={"span"}>
                            <Box fontSize={20} m={1}>
                              Waiting for your colleagues to
                            </Box>
                          </Typography>

                          <Typography component={"span"}>
                            <Box fontSize={20} m={1}>
                              finish, to go to the ranking page.
                            </Box>
                          </Typography>
                        </Grid>
                      </Grid>

                      <br />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {getStepContent(this.props.actualFigure)}
                      <br />
                      <br />
                    </React.Fragment>
                  )}
                </React.Fragment>
              </Grid>
            </Grid>
          </Paper>
          <br />
        </React.Fragment>
      );
    } else if (this.props.isEnd) {
      console.log("isEnd");
      if (this.state.is_running) {
        console.log("isEnd");
        this.setState({ is_running: false });
        this.stopSensors();
        this.updateRankig(this.state.gameUuid);
      }

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
              <Grid item xs={12} style={{ marginTop: "24px" }}>
                <Typography component={"span"}>
                  <Box fontWeight="fontWeightBold" fontSize={21}>
                    Game Ranking!
                  </Box>
                </Typography>
                <Lottie
                  options={defaultOptionsScore}
                  height={150}
                  width={150}
                />
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

              <Grid item xs={12}></Grid>
              <Button
                onClick={(e) => window.location.reload()}
                variant="contained"
                color="primary"
                endIcon={<HomeIcon />}
              >
                Go lobby
              </Button>
            </Grid>
            <br />
            <br />
          </Paper>
          <br />
        </div>
      );
    }
  }
}

export default withStyles(styles)(FigureManager);

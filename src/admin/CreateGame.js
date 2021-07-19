
const { REACT_APP_BACKEND_URL } = process.env;


import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import Title from "../components/Title";
import CreateIcon from "@material-ui/icons/Create";

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

class CreateGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxPlayers: 5,
      victoryConditions: 2,
      open: false,
    };
  }

  createRoom = (event, socket) => {
    //event.preventDefault();
    var gameName = document.getElementById("game-name-required").value;

    var victoryPoints = document.getElementById("victory-points").value;

    var victoryConditions = "";

    if (this.state.victoryConditions === 1) {
      victoryConditions = "POINTS";
    } else if (this.state.victoryConditions === 2) {
      victoryConditions = "TIME";
    }

    socket.send(
      JSON.stringify({
        action: "CREATE",
        name: gameName,
        maxPlayers: this.state.maxPlayers,
        victoryConditions: victoryConditions,
        condition: victoryPoints,
      })
    );

    this.setState({ open: true });

    //window.location.reload();

    fetch("https://"+REACT_APP_BACKEND_URL+":8090/game/list")
      .then((response) => response.json())
      .then((gameList) => this.setState({ gameList: gameList.gameList }));

      
  };

  handleChange = (event, state) => {
    this.setState({
      [state]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Paper className={classes.paper}>
          <Title>Create game:</Title>
          <br />
          <Grid item xs={12}>
            <form className={classes.root} noValidate autoComplete="off">
              <TextField
                required
                id="game-name-required"
                label="Match name"
                defaultValue="GameRoom1"
                variant="outlined"
              />
              <br />

              <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Max Players
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={this.state.maxPlayers}
                  onChange={(e) => this.handleChange(e, "maxPlayers")}
                  label="Maximum players"
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
              </FormControl>
              <br />

              <FormControl variant="outlined">
                <InputLabel id="victory-conditions-outlined-label">
                  Victory Conditions
                </InputLabel>
                <Select
                  labelId="victory-conditions-outlined-label"
                  id="victory-conditions-outlined"
                  value={this.state.victoryConditions}
                  onChange={(e) => this.handleChange(e, "victoryConditions")}
                  label="Victory conditions"
                >
                  <MenuItem value={1}>Points</MenuItem>
                  <MenuItem value={2}>Time</MenuItem>
                </Select>
              </FormControl>
              <br />

              <TextField
                id="victory-points"
                label="Seconds/points"
                defaultValue="100"
                variant="outlined"
                type="number"
              />
              <br />
              <br />
              <Button
                style={{margin: '0 auto', display: "flex"}}
                onClick={(e) => this.createRoom(e, this.props.socket)}
                variant="contained"
                color="primary"
                endIcon={<CreateIcon />}
              >
                Create game
              </Button>
            </form>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(CreateGame);

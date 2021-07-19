import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import LaSalleLogo from "../assets/logo-lasalle-estudy.png";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            href="/"
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <img src={LaSalleLogo} alt="LaSalle logo" />
          </IconButton>

          <Typography align="center" variant="h6" className={classes.title}>
            <Box fontWeight="fontWeightBold" fontSize={18}>
              Vibrations Game
            </Box>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

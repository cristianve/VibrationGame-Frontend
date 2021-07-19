import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ShakeImg from "../../../assets/Shake.jpg";
export default function ShakePattern() {
  return (
    <React.Fragment>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item xs={12}>
          <Paper>
            <img height="200" weight="200" src={ShakeImg} alt="Right" />
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LeftImg from "../../../assets/Left.jpg";
export default function LeftPattern() {
  return (
    <React.Fragment>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item xs={12}>
          <Paper>
            <img height="200" weight="200" src={LeftImg} alt="Right" />
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

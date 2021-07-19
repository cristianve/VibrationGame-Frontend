import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function Loading() {
  return (
    <Grid
      container
      justify="center"
      direction="column"
      alignItems="center"
      style={{ marginTop: 100, marginBottom: 100 }}
    >
      <Typography variant="h3" color="primary">
        <Box fontWeight="fontWeightBold" m={1}>
          Loading...
        </Box>
      </Typography>

      <CircularProgress size="150px" />
    </Grid>
  );
}

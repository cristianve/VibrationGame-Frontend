import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

export default function NicknameBoard(props) {
  return (
    <div>
      {/* Footer */}
      <Grid
        container
        spacing={4}
        direction="column"
        justify="center"
        alignItems="center"
        style={{ padding: "24px" }}
      >
        <Typography>Your assigned nickname:</Typography>

        <Typography style={{ marginTop: "24px" }} component={"span"}>
          <Box fontWeight="fontWeightBold" fontSize={21}>
            {props.randomName}
          </Box>
        </Typography>
      </Grid>
    </div>
  );
}

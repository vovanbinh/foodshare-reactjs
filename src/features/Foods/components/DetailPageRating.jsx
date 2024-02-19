import React from "react";
import PropTypes from "prop-types";
import { Avatar, Grid, Rating, Typography } from "@mui/material";
import { baseURL } from "../../../Constants/env";
import dayjs from "dayjs";

DetailPageRating.propTypes = {
  ratings: PropTypes.object,
};

DetailPageRating.defaultProps = {
  ratings: {},
};

function DetailPageRating({ ratings }) {
  return (
    <div>
      {Object.keys(ratings).length === 0 ? (
        <Typography variant="h6" marginLeft={2}>
          Chưa có phản hồi
        </Typography>
      ) : (
        ""
      )}
      {Object.keys(ratings).map((key) => {
        const rating = ratings[key];
        if (rating && rating.rating) {
          return (
            <div key={key} style={{ marginBottom: "10px" }}>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-start"
                padding={2}
              >
                <Grid marginRight={2}>
                  <Avatar
                    alt={rating?.user?.fullname}
                    src={`${baseURL}${rating?.user?.image}`}
                  />
                </Grid>
                <Grid>
                  <Typography color="warning" className="fw-bolder">
                    {rating?.user?.full_name
                      ? rating?.user?.full_name
                      : "Người ẩn danh"}
                  </Typography>
                  <Typography color="warning" className="text-muted">
                    {dayjs(rating?.rating?.created_at).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </Typography>
                </Grid>
              </Grid>
              <Rating
                style={{ paddingLeft: "13px" }}
                name="read-only-rating"
                value={rating?.rating?.rating}
                readOnly
              />
              <Typography paddingLeft={2}>{rating?.rating?.review}</Typography>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default DetailPageRating;

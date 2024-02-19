import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Link, useRouteMatch } from "react-router-dom";
import listPage from "./pages/ListPage";
import detailPage from "./pages/DetailPage";
import { Box } from "@mui/material";
import CategoryComponent from "./components/CategoryComponent";

function CategoryFood() {
  const { path } = useRouteMatch();
  const defaultPath = "/foods/tat-ca-thuc-pham";
  const currentPath = path || defaultPath;
  return (
    <Box>
      <Switch>
        <Route path={currentPath} exact component={CategoryComponent} />
        <Route path={`${currentPath}/:foodSlug`} component={detailPage} />
      </Switch>
    </Box>
  );
}

export default CategoryFood;

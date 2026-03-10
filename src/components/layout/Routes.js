import React from "react";
import LogIn from "../accounts/LogIn";
import { Switch, Route, Redirect } from "react-router-dom";
import SignUp from "../accounts/SignUp";
import Main from "../homepage/Main";
import RestaurantListPage from "../restaurants/RestaurantListPage";
import ViewProfile from "../accounts/ViewProfile";
import EditProfile from "../accounts/EditProfile";
import RegisterRestaurant from "../restaurants/RegisterRestaurant";
import Admin from "../../admin/admin";
import Order from "../restaurants/order_components/Order";
import Menu from "../restaurants/Menu";
import NoMatch from "../homepage/NoMatch";
import RestaurantProfile from "../restaurants/RestaurantProfile";
import EditMenu from "../restaurants/EditMenu";

const Routes = ({ user }) => {
  return (
    <Switch>
      <Route path="/order" component={Order}></Route>
      <Route exact path="/" component={Main}></Route>
      <Route exact path="/login" component={LogIn}></Route>
      <Route
        exact
        path="/admin"
        render={() =>
          user && user.admin ? <Admin /> : <Redirect to="/" />
        }
      ></Route>
      <Route exact path="/signup" component={SignUp}></Route>
      <Route exact path="/restaurants" component={RestaurantListPage}></Route>
      <Route
        exact
        path="/register-restaurant"
        component={RegisterRestaurant}
      ></Route>
      <Route path="/users/:userid" component={ViewProfile}></Route>
      <Route path="/edit_profile" component={EditProfile}></Route>
      <Route
        path="/manage_restaurants/:restaurantId"
        component={RestaurantProfile}
      ></Route>
      <Route path="/edit_menu/:restaurantId" component={EditMenu}></Route>
      <Route path="/menu/:restid" component={Menu} />
      <Route component={NoMatch} />
    </Switch>
  );
};

export default Routes;

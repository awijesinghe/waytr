import React, { useState } from "react";
import Firebase from "../../firebase/firebase";
import { Redirect } from "react-router-dom";
import uuid from "react-uuid";

const RegisterRestaurant = () => {
  const [restUID, setRestUID] = useState(null);
  const [restName, setRestName] = useState("");
  const [restStreetAddress, setRestStreetAddress] = useState("");
  const [restSuburb, setRestSuburb] = useState("");
  const [restPostcode, setRestPostcode] = useState("");
  const [restPhoneNumber, setRestPhoneNumber] = useState("");
  const [restCuisine, setRestCuisine] = useState("");
  const [routeRedirect, setRouteRedirect] = useState();

  const newRestaurant = {
    restUID,
    restName,
    restStreetAddress,
    restSuburb,
    restPostcode,
    restPhoneNumber,
    restCuisine
  };

  if (!restUID) {
    setRestUID(uuid());
  }

  const register = event => {
    event.preventDefault();
    Firebase.registerRest(newRestaurant);
    setRouteRedirect(true);
  };

  const redirect = routeRedirect;
  if (redirect) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <div className="container">
        <form onSubmit={register} className="white">
          <h5 className="grey-text text-darken-3 center">
            Register Your Restaurant
          </h5>
          <div className="input-field">
            <label htmlFor="restName">Restaurant Name</label>
            <input
              type="text"
              id="restName"
              required
              onChange={event => setRestName(event.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="restStreetAddress">Street Address</label>
            <input
              type="text"
              id="restStreetAddress"
              required
              onChange={event => setRestStreetAddress(event.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="restSuburb">Suburb/Town</label>
            <input
              type="text"
              id="restSuburb"
              required
              onChange={event => setRestSuburb(event.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="restPostcode">Postcode</label>
            <input
              type="text"
              id="restPostCode"
              required
              onChange={event => setRestPostcode(event.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="restPhoneNumber">Phone Number</label>
            <input
              type="text"
              id="restPhoneNumber"
              required
              onChange={event => setRestPhoneNumber(event.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="restCuisine">Cuisine</label>
            <input
              type="text"
              id="restCuisine"
              required
              onChange={event => setRestCuisine(event.target.value)}
            />
          </div>
          <div className="input-field center">
            <button className="btn green lighten-1 z-depth-0">
              Create Account
            </button>
          </div>
          <div className="center">
            Already registered?
            <a href="/login"> Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterRestaurant;

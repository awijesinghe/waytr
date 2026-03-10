import React, { useState, useContext, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { RestaurantInfoContext } from "../../contexts/RestaurantInfoContext";
import Firebase from "../../firebase/firebase";

const RestaurantProfile = () => {
  const { restData, restDocId } = useContext(RestaurantInfoContext);
  const [isEditingData, setIsEditingData] = useState(false);
  const [newRestData, setNewRestData] = useState({});

  useEffect(() => {
    setNewRestData({ ...restData });
  }, [restData]);

  if (!restData) {
    return <Redirect to={"/"} />;
  }

  const toggleDataEdit = event => {
    event.preventDefault();
    setIsEditingData(!isEditingData);
  };

  const saveChanges = event => {
    const {
      restCuisine,
      restName,
      restPhoneNumber,
      restPostcode,
      restStreetAddress,
      restSuburb,
      restTableMin,
      restTableMax
    } = newRestData;

    Firebase.db
      .collection("restaurants")
      .doc(restDocId)
      .update({
        restCuisine,
        restName,
        restPhoneNumber,
        restPostcode,
        restStreetAddress,
        restSuburb,
        restTableMin,
        restTableMax
      })
      .then(() => setIsEditingData(false));
  };

  let ViewEdit = isEditingData ? (
    <div>
      <div className="card-content">
        <label htmlFor="Restaurant Name">Restaurant Name</label>
        <input
          required
          defaultValue={restData.restName}
          onChange={event =>
            setNewRestData({ ...newRestData, restName: event.target.value })
          }
        />
        <label htmlFor="Cuisine">Cuisine</label>
        <input
          required
          defaultValue={restData.restCuisine}
          onChange={event =>
            setNewRestData({ ...newRestData, restCuisine: event.target.value })
          }
        />
        <label htmlFor="Street Address">Street Address</label>
        <input
          required
          defaultValue={restData.restStreetAddress}
          onChange={event =>
            setNewRestData({
              ...newRestData,
              restStreetAddress: event.target.value
            })
          }
        />
        <label htmlFor="Suburb">Suburb</label>
        <input
          required
          defaultValue={restData.restSuburb}
          onChange={event =>
            setNewRestData({ ...newRestData, restSuburb: event.target.value })
          }
        />
        <label htmlFor="Postcode">Postcode</label>
        <input
          required
          defaultValue={restData.restPostcode}
          onChange={event =>
            setNewRestData({ ...newRestData, restPostcode: event.target.value })
          }
        />
        <label htmlFor="PhoneNumber">Phone Number</label>
        <input
          required
          defaultValue={restData.restPhoneNumber}
          onChange={event =>
            setNewRestData({
              ...newRestData,
              restPhoneNumber: event.target.value
            })
          }
        />
        <label htmlFor="PhoneNumber">Table Number Range</label>
        <div>
          <div className="input-field inline">
            <input
              type="number"
              required
              min="1"
              defaultValue={newRestData.restTableMin}
              onChange={event =>
                setNewRestData({
                  ...newRestData,
                  restTableMin: event.target.value
                })
              }
            />
          </div>{" "}
          <div className="input-field inline">
            <input
              type="number"
              required
              min="1"
              defaultValue={newRestData.restTableMax}
              onChange={event =>
                setNewRestData({
                  ...newRestData,
                  restTableMax: event.target.value
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="center">
        <button onClick={saveChanges} className="btn green orderButtons">
          Save Changes
        </button>
        <button onClick={toggleDataEdit} className="btn green orderButtons">
          Discard Changes
        </button>
      </div>
    </div>
  ) : (
    <div>
      <div className="card-content center">
        <p>Restaurant Name: {restData.restName}</p>
        <p>Cuisine: {restData.restCuisine}</p>
        <p>Address: {restData.restStreetAddress}</p>
        <p>Suburb: {restData.restSuburb}</p>
        <p>Postcode: {restData.restPostcode}</p>
        <p>Phone Number: {restData.restPhoneNumber}</p>
      </div>
      <div className="center">
        <button onClick={toggleDataEdit} className="btn green orderButtons">
          Edit Information
        </button>
        <Link
          to={"/edit_menu/" + restData.restUID}
          className="btn green orderButtons"
        >
          Edit Menu
        </Link>
        <button className="btn green orderButtons">
          Add Restaurant Priveledge
        </button>
      </div>
    </div>
  );
  if (restData.hasOwnProperty("restCuisine")) {
    return (
      <div className="container">
        <div className="card">
          <div>
            <h4 className="center">Restaurant Information</h4>
          </div>
          {ViewEdit}
        </div>
      </div>
    );
  } else {
    return <div className="loader container center"></div>;
  }
};

export default RestaurantProfile;

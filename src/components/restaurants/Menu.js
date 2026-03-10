import React, { useState, useEffect } from "react";
import Firebase from "../../firebase/firebase";

const Menu = props => {
  const restid = props.match.params.restid;
  const [isLoading, setIsLoading] = useState(true);
  const [menuData, setMenuData] = useState();

  useEffect(() => {
    Firebase.getRestaurantMenu(restid)
      .then(response => {
        setMenuData(response.menu);
        setIsLoading(response.loading);
      })
      .catch(() => setIsLoading(false));
  }, [restid]);

  if (!isLoading && menuData) {
    if (Object.keys(menuData).length > 0) {
      return (
        <div className="container center">
          <h4>Menu of {menuData.restName}</h4>
          <div className="card">
            {menuData.items.map((item, i) => (
              <div key={i} className="card-content">
                <p>{menuData.items[i]}</p>
                <p>{menuData.descriptions[i]}</p>
                <p>${menuData.prices[i]}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="container center">
        <h3>Error 404: Unable to find restaurant/menu</h3>
      </div>
    );
  }
  return <div className="loader container center"></div>;
};

export default Menu;

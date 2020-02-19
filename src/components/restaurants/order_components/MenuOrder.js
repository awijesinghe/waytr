import React, { useState, useEffect, useRef } from "react";
import Firebase from "../../../firebase/firebase";

const MenuOrder = values => {
  const { restid, toggleMenu, orders, socket } = values;
  const [isLoading, setIsLoading] = useState(true);
  const [menuData, setMenuData] = useState();
  const [tempOrder, setTempOrders] = useState([]);
  const _isMounted = useRef(true);

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  Firebase.getRestaurantMenu(restid)
    .then(response => {
      if (_isMounted.current) {
        if (isLoading !== response.loading) {
          setIsLoading(response.loading);
        }
        if (!isLoading && !menuData) {
          setMenuData(response.menu);
        }
      }
    })
    .catch(error => console.log(error));

  const addOrder = event => {
    event.preventDefault();

    tempOrder.map(item => {
      orders.map(order => {
        if (order.item === item.item) {
          item.quantity = item.quantity + order.quantity;
        }
        return order;
      });
      return item;
    });

    let concat = tempOrder.concat(orders);
    let updatedOrders = Array.from(
      new Set(concat.map(order => order.item))
    ).map(i => {
      return concat.find(order => order.item === i);
    });

    if (updatedOrders.length !== 0) {
      socket.emit("sendTempOrder", updatedOrders, () => {});
    }
    toggleMenu(event);
  };

  if (!isLoading && menuData) {
    if (Object.keys(menuData).length > 0) {
      return (
        <div className="container">
          <h4 className="center ">Menu of {menuData.restName}</h4>
          <div className="card">
            {menuData.items.map(item => (
              <div key={menuData.items.indexOf(item)} className="card-content">
                <div>{menuData.items[menuData.items.indexOf(item)]}</div>
                <div>
                  {menuData.descriptions[menuData.items.indexOf(item)]}
                  <input
                    type="number"
                    min="0"
                    className="orderQuantity"
                    id={menuData.items[menuData.items.indexOf(item)]}
                    onChange={event => {
                      let newOrder = tempOrder.filter(item => {
                        return item.item !== event.target.id;
                      });
                      if (event.target.value > 0) {
                        setTempOrders([
                          ...newOrder,
                          {
                            item: event.target.id,
                            quantity: +event.target.value,
                            price: +menuData.prices[
                              menuData.items.indexOf(item)
                            ]
                          }
                        ]);
                      } else {
                        setTempOrders([...newOrder]);
                      }
                    }}
                  />
                </div>
                <div>${menuData.prices[menuData.items.indexOf(item)]}</div>
              </div>
            ))}
          </div>
          <div className="center">
            <button onClick={addOrder} className="btn green">
              Add to order
            </button>{" "}
            {"  "}
            <button onClick={toggleMenu} className="btn green">
              Back to order
            </button>
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

export default MenuOrder;

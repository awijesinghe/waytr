import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import MenuOrder from "./MenuOrder";
import Firebase from "../../../firebase/firebase";

let socket;

const Order = ({ location }) => {
  const [restaurantId, setRestaurantId] = useState("");
  const [restName, setRestName] = useState("");
  const [uid, setUid] = useState("");
  const [tableNum, setTableNum] = useState("");
  const [orders, setOrders] = useState([]);
  const [dbOrders, setDbOrders] = useState();
  const [menuView, setMenuView] = useState(false);
  const [orderDocId, setOrderDocId] = useState("");
  const ENDPOINT = "localhost:5000";
  const currentDateTime = Math.round(new Date().getTime() / 1000);

  useEffect(() => {
    const { restaurantId, tableNum, restName, uid, name } = queryString.parse(
      location.search
    );
    socket = io(ENDPOINT);

    setRestaurantId(restaurantId);
    setRestName(restName);
    setUid(uid);
    setTableNum(tableNum);

    socket.emit(
      "join",
      { uid, name, restaurantId, restName, tableNum },
      () => {}
    );

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    let _orders;
    Firebase.db
      .collection("orders")
      .where("tableNum", "==", tableNum)
      .where("restaurantId", "==", restaurantId)
      .where("orderCompleted", "==", false)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (
            (change.type === "added" || change.type === "modified") &&
            currentDateTime - change.doc.data().orderDateTime.seconds < 3600
          ) {
            _orders = change.doc.data().orders;
            setOrderDocId(change.doc.id);
          }
        });
        setDbOrders(_orders);
      });
  }, [tableNum, restaurantId, uid, currentDateTime]);

  useEffect(() => {
    socket.on("message", () => {
      console.log("staff has been notified");
    });
    socket.on("order", order => {
      setOrders(order);
    });
    socket.on("orderSent", () => {
      setOrders([]);
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, []);
  const sendOrder = event => {
    event.preventDefault();
    if (orders.length > 0) {
      if (!dbOrders) {
        Firebase.sendOrder({
          orders,
          restaurantId,
          restName,
          tableNum,
          uid,
          orderDateTime: new Date(),
          orderCompleted: false
        }).then(() => {
          setOrders([]);
        });
      } else {
        orders.map(item => {
          dbOrders.map(order => {
            if (order.item === item.item) {
              item.quantity = item.quantity + order.quantity;
            }
            return order;
          });
          return item;
        });
        let concat = orders.concat(dbOrders);
        let updatedOrders = Array.from(
          new Set(concat.map(order => order.item))
        ).map(i => {
          return concat.find(order => order.item === i);
        });
        Firebase.db
          .collection("orders")
          .doc(orderDocId)
          .update({ orders: updatedOrders });
        setOrders([]);
      }

      socket.emit("sendOrder", null, () => {});
    }
  };

  const removeMessage = event => {
    let i = event.target.value;
    let updatedOrders = orders.filter(order => {
      return order !== orders[i];
    });
    setOrders(updatedOrders);
    socket.emit("sendTempOrder", updatedOrders, () => {});
  };

  const service = event => {
    event.preventDefault();
    let i = event.target.value;
    socket.emit("staffRequest", i, () => {});
    if (i === "bill") {
      if (dbOrders) {
        Firebase.db
          .collection("orders")
          .doc(orderDocId)
          .update({ orderCompleted: true });
      }
    }
  };

  const toggleMenu = event => {
    event.preventDefault();
    setMenuView(!menuView);
  };

  var pendingTotal = 0.0;
  orders.map(
    order => (pendingTotal = pendingTotal + order.price * order.quantity)
  );
  var currentTotal = 0.0;

  if (dbOrders) {
    dbOrders.map(item => {
      currentTotal = currentTotal + item.price * item.quantity;
      return currentTotal;
    });
  }

  let orderView = menuView ? (
    <MenuOrder
      toggleMenu={toggleMenu}
      restid={restaurantId}
      orders={orders}
      socket={socket}
    />
  ) : (
    <div className="container">
      <div>
        <h4 className="center">
          Eating at {restName} Table Number: {tableNum}{" "}
        </h4>
      </div>
      <div className="center">
        <p className="thick">Orders Pending - Total: ${pendingTotal}</p>
        {orders.map((order, i) => (
          <div key={i}>
            <p>
              x{order.quantity} | ${order.price} | {order.item}
              <button onClick={removeMessage} value={i} className="text">
                x
              </button>
            </p>
          </div>
        ))}
      </div>
      <div className="divider"></div>
      <div className="center">
        <p className="thick">Current Orders - Current Total: ${currentTotal}</p>
        {dbOrders &&
          dbOrders.map((dbOrder, j) => (
            <div key={j}>
              {" "}
              <p>
                x{dbOrder.quantity} | ${dbOrder.price} | {dbOrder.item}
              </p>
            </div>
          ))}
        <p></p>
      </div>
      <div className="center">
        <button
          onClick={sendOrder}
          className="btn orderButtons waves-effect waves-light green"
        >
          Send order
        </button>
        <button
          onClick={toggleMenu}
          className="btn orderButtons waves-effect waves-light green"
        >
          Menu
        </button>
        <button
          value="bill"
          onClick={service}
          className="btn orderButtons waves-effect waves-light green"
        >
          Get bill
        </button>
        <button
          value="staff"
          onClick={service}
          className="btn orderButtons waves-effect waves-light green"
        >
          Call staff
        </button>{" "}
      </div>
      <div className="center">
        <a href="/" className="btn green exit">
          Exit Order
        </a>
      </div>
    </div>
  );

  return orderView;
};

export default Order;

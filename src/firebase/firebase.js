import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";


var firebaseConfig = {
  apiKey: "AIzaSyBfL5Zv3KtO5T-jF8yPf96LlcKsUgULWws",
  authDomain: "waytr-f5fb7.firebaseapp.com",
  databaseURL: "https://waytr-f5fb7.firebaseio.com",
  projectId: "waytr-f5fb7",
  storageBucket: "waytr-f5fb7.appspot.com",
  messagingSenderId: "890384060345",
  appId: "1:890384060345:web:ccd51196e55ede05923068",
  measurementId: "G-RZNMHQCF94"
};

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.functions = firebase.functions();
  }

  async loginEmail(email, password) {
    const user = await this.auth
      .signInWithEmailAndPassword(email, password)
      .catch(err => {
        console.log(err);
        return err;
      });
    return user;
  }

  async signOut() {
    const SignOut = this.auth.signOut().catch(err => {
      console.log(err);
      return err;
    });
    return SignOut;
  }

  async signUp(newUser) {
    const { firstName, lastName, email, password } = newUser;
    const user = await this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        response.user.updateProfile({
          displayName: firstName
        });
        this.db
          .collection("users")
          .doc(response.user.uid)
          .set({
            firstName,
            lastName
          });
        return response;
      })
      .catch(err => {
        console.log(err);
        return err;
      });
    return user;
  }

  async registerRest(newRestaurant) {
    const {
      restName,
      restStreetAddress,
      restSuburb,
      restPostcode,
      restPhoneNumber,
      restCuisine,
      restUID
    } = newRestaurant;

    this.db
      .collection("restaurants")
      .doc()
      .set({
        restName,
        restStreetAddress,
        restSuburb,
        restPostcode,
        restPhoneNumber,
        restCuisine,
        restUID
      })
      .catch(error => {
        return error;
      });
  }

  async getUserData(uid) {
    try {
      const doc = await this.db.doc("users/" + uid).get();
      return { userData: doc.exists ? doc.data() : {}, loading: false };
    } catch (error) {
      return { userData: {}, loading: false, error };
    }
  }

  async getRestaurantList() {
    try {
      const snapshot = await this.db.collection("restaurants").get();
      const restCollection = snapshot.docs.map(doc => ({
        ...doc.data(),
        docId: doc.id
      }));
      return { restCollection, loading: false };
    } catch (error) {
      return { restCollection: [], loading: false, error };
    }
  }

  async getRestaurantMenu(restid) {
    try {
      const doc = await this.db.doc("menu/" + restid).get();
      return { menu: doc.exists ? doc.data() : {}, loading: false, error: null };
    } catch (error) {
      return { menu: {}, loading: false, error };
    }
  }

  async sendOrder(orderInfo) {
    const {
      orders,
      restaurantId,
      restName,
      tableNum,
      uid,
      orderDateTime,
      orderCompleted
    } = orderInfo;
    return this.db
      .collection("orders")
      .doc()
      .set({
        orders,
        restaurantId,
        restName,
        tableNum,
        uid,
        orderDateTime,
        orderCompleted
      });
  }
}

export default new Firebase();

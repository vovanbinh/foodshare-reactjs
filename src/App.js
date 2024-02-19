import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/Header';
import DonateFood from './features/DonateFood/DonateFood';
import DetailFoodLocation from './features/FoodLocations/DetailFoodLocation';
import FoodLocations from './features/FoodLocations/FoodLocations';
import DetailReceived from './features/FoodReceived/DetailReceived';
import FoodReceived from './features/FoodReceived/FoodReceived';
import CategoryFood from './features/Foods/CategoryFood';
import DetailPageDonated from './features/ManageFoodDonated/DetailPageDonated';
import EditFood from './features/ManageFoodDonated/EditFood/EditFood';
import ManageFoodDonated from './features/ManageFoodDonated/ManageFoodDonated';
import ManageHistoryDonate from './features/ManageHistoryDonated/ManageHistoryDonate';
import NoticeMain from './features/Notice/NoticeMain';
import Profice from './features/Profice/Profice';
import QRcodeCollectFood from './features/QRcodeCollectFood/QRcodeCollectFood';
import MapWithGoong from './MapWithGoong';
import Chat from './features/Chat/Chat';
const PrivateRoute = ({ component: Component, ...rest }) => {
  const currentUser = useSelector((state) => state.user.current);
  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser && currentUser.id ? (
          <Component {...props} />
        ) : (
          <Redirect to="/foods/tat-ca-thuc-pham" />
        )
      }
    />
  );
};

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/foods/:category" component={CategoryFood} />
        <Route path="/map" component={MapWithGoong} />
        <Route path="/food-donation-locations/:locationSlug" component={DetailFoodLocation} />
        <Route path="/food-donation-locations" component={FoodLocations} />
        <PrivateRoute path={`/food-received/:foodId`} component={DetailReceived} />
        <PrivateRoute path={`/chat/:userId`} component={Chat} />
        <PrivateRoute path={`/manager-food-donated/view/:foodId`} component={DetailPageDonated} />
        <PrivateRoute path="/food-received" component={FoodReceived} />
        <PrivateRoute path="/donate-foods" component={DonateFood} />
        <PrivateRoute path="/notification/:tab" component={NoticeMain} />
        <PrivateRoute path="/manager-food-donated/edit/:id" component={EditFood} />
        <PrivateRoute path="/manager-history-food-donated" component={ManageHistoryDonate} />
        <PrivateRoute path="/manager-food-donated" component={ManageFoodDonated} />
        <PrivateRoute path="/profice/:tab" component={Profice} />
        <Route path="/qrcode-collect-food/:transactionId" component={QRcodeCollectFood} />
        <Route path="*" render={() => <Redirect to="/foods/tat-ca-thuc-pham" />} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

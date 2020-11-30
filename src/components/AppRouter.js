import React from 'react';
import { BrowserRouter as Router, Route,Nav, Link } from 'react-router-dom';
import Signup from "./auth_component/Signup"
import Login from './auth_component/Login';
import Campaigns from "./campaign_component/CampaignsList"
import Comments from "./comment_component/commentsList"
import Discussiontopics from './discussiontopic_component/DiscussionTopicsList'
import Users from "./user_component/UsersList"
import UserForm from "./user_component/User_form"
import Camapign from "./campaign_component/campaign"

export default class AppRouter extends React.Component{
render(){
  return (
    <Router>
      <div>
        <Route path="/login" component={Login} />
        <Route exact path="/" component={Signup} />
        <Route path="/campaigns" component={Campaigns} />
        <Route path="/campaign" component={Camapign} />
        <Route path="/comments" component={Comments} />
        <Route path="/discussiontopics" component={Discussiontopics} />
        <Route path="/users" component={Users} />
        <Route path="/adduser" component={UserForm} />

        
      </div>
    </Router>
    )
  }
}

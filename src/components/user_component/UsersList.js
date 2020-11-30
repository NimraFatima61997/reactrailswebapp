import React from 'react'
import $ from "jquery"
import Navbar from "../navbar"
export default class UsersList extends React.Component{
  state={
    data:[],
    user_selected:false,
    user:[],
  }
  componentDidMount(){
    $.ajax({
      type: "GET",
      url: 'https://reactrailsapi.herokuapp.com/users',
      dataType: "JSON",
    }).done((data) => {
      this.setState({data})
    });
  }

  handleChange(user){
    this.setState({user:user,user_selected:true})
  }
  render(){
    return(
      <div className="align">  
        {sessionStorage.getItem("user_signed_in")==="login"?
          <div>
            <Navbar/>
            {this.state.data.length?this.state.data.map((user) =>
              <div className="users_list">
                <h3>{user.user_type }</h3>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Status: {user.status}<button onClick={()=>this.handleChange(user)}>Change Status</button></p>
              </div>
            ):<h5>No User</h5>}
            {this.state.user_selected?this.props.history.push({pathname: '/adduser', state: {user: this.state.user}}):null}
          </div>
        :this.props.location.push("login")}
      </div>
    )
  }
}
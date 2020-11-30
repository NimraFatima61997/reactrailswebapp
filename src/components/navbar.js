import React from "react"
import $ from "jquery"
import { BrowserRouter as Nav, Link } from 'react-router-dom';
export default class Navbar extends React.Component{

  state={
    current_user:[],
  }
  componentDidMount()
  {
    if(sessionStorage.getItem("user_signed_in")==="login")
    {
      $.ajax({
        type: "GET",
        url: 'https://reactrailsapi.herokuapp.com/users/currentuser',
        headers: JSON.parse(sessionStorage.user)
      }).done((data) => {
        this.setState({current_user:data})
      });
    }
  }
  logout(){
    $.ajax({
      type: 'DELETE',
      url: 'https://reactrailsapi.herokuapp.com/auth/sign_out',
      headers: JSON.parse(sessionStorage.user)
    })
    .done((data) => {
      sessionStorage.user_signed_in="logout";
    })
  }
  render(){
    return(
      <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
          <div class="navbar-header">
            <div className="left"><Link  to="/campaigns" class="navbar-brand" >Feedback Form</Link></div>
          </div>
          {sessionStorage.getItem("user_signed_in")==="login"?this.state.current_user.user_type==="Expert"?<Link  to="/users" className="login" >Users</Link>:null:null}
          {sessionStorage.getItem("user_signed_in")==="login"? <Link  to="/login" className="logout" onClick={()=>this.logout()} >Log Out</Link>:<Link  to="/login" className="login" >Log In</Link>}
        </div>
      </nav>
    )
  }
}
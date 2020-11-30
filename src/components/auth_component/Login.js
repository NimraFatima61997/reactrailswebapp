import React from 'react';
import $ from 'jquery';
import Navbar from "../navbar"
import "../../stylesheets/auth.css"
import "../../stylesheets/signup.css"
export default class Login extends React.Component {

  state={
    errors:[]
  }
  handleLogin = (e) => {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: 'https://reactrailsapi.herokuapp.com/auth/sign_in',
        data: {
          email: this.email.value,
          password: this.password.value
        }
      })
    .done((response, status, jqXHR) => {
        sessionStorage.setItem('user',
          JSON.stringify({
            'access-token': jqXHR.getResponseHeader('access-token'),
            client: jqXHR.getResponseHeader('client'),
            uid: response.data.uid
            
          }),
          sessionStorage.user_name=response.data.name
          );
          
          sessionStorage.user_signed_in="login";
        this.props.history.push('/campaigns');
      })
      .fail((response) => {
        this.setState({errors: response.responseJSON.errors})
      })
  }

  render () {
    return (
      <>
   <div class="body">
        <Navbar/>
        <div className="error"> 
          <div className="auth_row">
            <div className="auth_column">
              <span style={{color: "white"}}>
                <ul>{this.state.errors.map((error)=><div> <li>{error} </li></div>)}</ul>
              </span>
            </div>
          </div>
        </div>
        <div class="container">  
        <div class="row">
          <div class="card">
          <form class="box" onSubmit={(event)=>this.handleLogin(event)}>
            <div><h2 class="align_center">Log in</h2><br></br>
            <label htmlFor="content">Email:</label>
            <input name="email" ref={(input) => this.email = input } /></div>
            <label htmlFor="content">Password:</label>
            <input name="password" type="password" ref={(input) => this.password = input } />
            <input type="submit"/>
            <p>New user ?  <button onClick={()=>this.props.history.push("/")}>Sign Up</button></p>
          </form>
          </div></div>
        </div>
        </div>
      </>
    )
  }
}

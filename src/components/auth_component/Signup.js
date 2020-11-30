import React from 'react';
import $ from 'jquery';
import Navbar from "../navbar"
import "../../stylesheets/auth.css"
import "../../stylesheets/signup.css"

export default class Signup extends React.Component {

  constructor(props){
    super(props)
    this.state={
    status_type: {"qualified":0, "not_qualified":1, "banned":2}, 
    user_type: {"Novice":0,"Expert":1},
    user:"",
    status:"",
    errors:{}, 
    signup_errors:[]
    }
  }

  handleValidation(){
    let errors=this.state.errors;
    let formIsValid=true;
    if(!this.email.value){
      formIsValid = false;
      errors["email"] = "  Email cannot be empty";
      }
      else
      errors["email"] = "";  
    if(!this.name.value){
      formIsValid = false;
      errors["name"] = "Name cannot be empty";
      }
      else
      errors["name"] = "";  
    if(!this.state.user){
      formIsValid = false;
      errors["user_type"] = "User_type cannot be empty";
      }
    else
    errors["user_type"] = ""
    if(!this.state.status){
      formIsValid = false;
      errors["status"] = " Status cannot be empty";
      }
    else
    errors["status"] = ""
    if(this.state.user==="Expert")
    {
      if(!this.profession.value){
        formIsValid = false;
        errors["profession"] = "Profession cannot be empty";
        }
        else
        errors["profession"] = "";  
      if(!this.service.value){
        formIsValid = false;
        errors["service"] = "Service cannot be empty";
        }
      else
      errors["service"] = ""
    }


    this.setState({errors: errors});
    return formIsValid;
  }

  handleLogin = (e) => {
    e.preventDefault();
    if(this.handleValidation()){
      const data={
        email: this.email.value,
        password: this.password.value,
        name: this.name?this.name.value:null,
        status: this.state.status?this.state.status:null,
        user_type: this.state.user?this.state.user:null,
        service: this.service?this.service.value:null,
        prefession: this.profession?this.profession.value:null,
      }
    $.ajax({
        type: 'POST',
        url: 'https://reactrailsapi.herokuapp.com/auth',
        data: data
      })

      .done((response, status, jqXHR) => {
          sessionStorage.setItem('user',
            JSON.stringify({
              'access-token': jqXHR.getResponseHeader('access-token'),
              client: jqXHR.getResponseHeader('client'),
              uid: response.data.uid
            }));
            sessionStorage.user_signed_in="login";
            sessionStorage.user_name=this.name.value
          this.props.history.push('/campaigns');
        })
        .fail((response) => {
          this.setState({signup_errors: response.responseJSON.errors.full_messages})
        })
    }
  }
  handleChange(type, e){    
    switch(type)
    {
      case "status":this.setState({status: e.target.value}) 
      break;
      case "user":this.setState({user:e.target.value})
      break;
    }     
  }

  render () {
    return (
      <div class="body">
        <Navbar/>
        <div className="error"> 
          <div className="auth_row">
            <div className="auth_column">
              <span style={{color: "white"}}>
                <ul>{this.state.signup_errors.map((error)=><div> <li>{error} </li></div>)}</ul>
                <ul>
                  {this.state.errors["email"]? <div><li>{this.state.errors["email"]}</li></div>:null}
                  {this.state.errors["name"]? <div><li>{this.state.errors["name"]}</li></div>:null}
                  {this.state.errors["status"]?<div><li>{this.state.errors["status"]}</li></div>:null}
                  {this.state.errors["profession"]?<div><li>{this.state.errors["profession"]}</li></div>:null}
                  {this.state.errors["service"]?<div><li>{this.state.errors["service"]}</li></div>:null}
                  {this.state.errors["user_type"]?<div><li>{this.state.errors["user_type"]}</li></div>:null}
                </ul>
              </span>
            </div>
          </div>
        </div>
        <div class="container">  
        <div class="row">
          <div class="card">
          <form class="box"  onSubmit={(event)=>this.handleLogin(event)} >
            <h2 class="align_center">Sign up</h2>  
            <div>
              <label htmlFor="content">Name: </label>
              <input name="name" ref={(input) => this.name = input } />
            </div><div>
              <label htmlFor="content">Email:</label>
              <input name="email" ref={(input) => this.email = input } />
            </div>
            <div>
              <label htmlFor="content">Password:  </label>
              <input name="password" type="password" ref={(input) => this.password = input } />
            </div>
            <div >
              <label htmlFor="content">Status: </label>
              <select name="status" onChange={this.handleChange.bind(this, "status")}>
                <option value="" disabled selected>Choose status</option>
                {Object.keys(this.state.status_type).map(key => (
                  <option key={this.state.status_type[key]} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="content">User Type: </label>
              <select name="user_type" onChange={this.handleChange.bind(this, "user")}>
                <option value="" disabled selected>Choose user type</option>
                {Object.keys(this.state.user_type).map(key => (
                  <option key={this.state.user_type[key]} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            {this.state.user=="Expert"?
              <div>
                <div>
                  <label htmlFor="content">Service: </label>
                  <input name="service" ref={(input) => this.service = input } />
                </div>
                <div>
                  <label htmlFor="content">Profession: </label>
                  <input name="profession" ref={(input) => this.profession = input } />
                </div>
              </div>
              :null}
            <input type="submit"/>
            <p>Already have account ?  <button onClick={()=>this.props.history.push("/login")}>Sign In</button></p>
          </form></div></div>
        
      </div>
      </div>
    )
  }
}

import React from 'react';
import $ from 'jquery';
import Navbar from "../navbar"
export default class Signup extends React.Component {

  constructor(props){
    super(props)
    this.state={
    status_type: {"qualified":0, "not_qualified":1, "banned":2}, 
    status:"qualified", 
    } 
  }
  handleLogin = (e) => {
    e.preventDefault();

    const user={
      id: this.props.location.state.user.id,
      status: this.state.status?this.state.status:null,  
    }
   $.ajax({
      type: 'PUT',
      url: 'http://localhost:3000/users/'+user.id,
      data: {user: user}
    })

    .done((response, status, jqXHR) => {
        this.props.history.push('/users');
      })
  }
  
  handleChange( e){    
    this.setState({status: e.target.value})    
  }

  render () {
    const user=this.props.location.state.user;
    return (
      <div>
        {sessionStorage.getItem("user_signed_in")==="login"?
          <div className="container">
            <Navbar/>
            <form onSubmit={(event)=>this.handleLogin(event)} >
              <div>
                <label htmlFor="content">{user.name} </label>
              </div><div>
                <label htmlFor="content">{user.email}</label>
              </div>
              <div>
                <label htmlFor="content">Status: </label>
                <select name="status"  onChange={this.handleChange.bind(this)}>
                  {Object.keys(this.state.status_type).map(key => (
                    <option key={this.state.status_type[key]} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>
              <input type="submit"/>
            </form>
            </div>
          :this.props.history.push("/login")}
      </div>
    )
  }
}

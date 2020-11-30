import React from 'react'
import $ from "jquery"
import Navbar from "../navbar"
export default class CampaignsList extends React.Component{
  state={
    data:[],
    commentslist:false,
    id:0,
    errors:{},
    title:"",
    current_user:[],
    cannot_create:"",
  }
  componentDidMount(){
    const  campaign= {id: this.props.location.state.campaign_id, type:this.props.location.state.type} 
    $.ajax({
      type: "GET",
      url: 'https://reactrailsapi.herokuapp.com/discussiontopics',
      dataType: "JSON",
      data: {campaign: campaign },
      headers: JSON.parse(sessionStorage.user)
    })
    .done((data) => {
      this.setState({data:data})
    })
    
  }
  handleValidation(){
    let errors=this.state.errors;
    let formIsValid=true;
    
    if(!this.state.title){
      formIsValid = false;
      errors["title"] = "Cannot be empty";
      }
      else
      errors["title"] = "";  
    this.setState({errors: errors});
    return formIsValid;
  }

  handleSubmit(event)
  {
    event.preventDefault();
    if(this.handleValidation()){
      const discussiontopic= { title: this.state.title }
      const  campaign= {id: this.props.location.state.campaign_id}
      $.ajax({
        type: 'POST',
        url: 'https://reactrailsapi.herokuapp.com/discussiontopics',
        data: {discussiontopic:discussiontopic, campaign: campaign},
        headers: JSON.parse(sessionStorage.user)
      })
      .done((data) => {
        const  campaign= {id: this.props.location.state.campaign_id, type:this.props.location.state.type} 
        $.ajax({
          type: "GET",
          url: 'https://reactrailsapi.herokuapp.com/discussiontopics',
          dataType: "JSON",
          data: {campaign: campaign },
          headers: JSON.parse(sessionStorage.user)
        }).done((data) => {
          this.setState({data:data, title: "",cannot_create:""})
        });
      })
      .fail((response)=>{
        this.setState({cannot_create:response.responseText})
      })
    }
  }

  cancreate(){
    $.ajax({
      type: "GET",
      url: 'https://reactrailsapi.herokuapp.com/users/currentuser',
      headers: JSON.parse(sessionStorage.user)
    }).done((data) => {
      this.setState({current_user:data})
    });
    if(this.state.current_user.status==="qualifeid")
    {
      
    }
  }
  handleChange(field, e){           
    this.setState({title:e.target.value});
  }
  comments(id){
    this.setState({id:id, commentslist:true})
  }
  render(){
    return(
      <div> 
        {sessionStorage.getItem("user_signed_in")==="login"?
          <div>
            <Navbar/>
            <div className="CampaignList-container">
            <div className="row">
              <div className="column">
                  {this.state.data.length?this.state.data.map((discussiontopic) =>
                  <div>
                    <div class="page-content page-container" id="page-content">
                      <div class="padding">
                        <div class="row">
                          <div class="col-sm-20">
                            <div class="list list-row block">
                              <div class="list-item">

                                  <div class="flex">
                                    <div class="item-except text-muted text-sm h-1x">{discussiontopic.title}</div>
                                    <br></br>
                                    <button onClick={()=>this.comments(discussiontopic.id)}>Show Comments</button>
                   
                                     </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>


                     
                    ):<h3>No Discussion Topic</h3>}
                </div>
              </div>
            </div>

            <div className="CampaignList-form-container">
              <form  onSubmit={(event)=>this.handleSubmit(event)}>
                <br/>
                <div >
                  <label> Title</label>
                  <br/>
                  <input type="text" name="title" onChange={this.handleChange.bind(this, "title")} value={this.state.title}  />
                  <span style={{color: "red"}}>{this.state.errors["title"]}</span>
                </div>
                <div>
                  <br/><br/>
                  <input type="submit"/>
                </div>
              </form>
              <br></br>
              <span style={{color: "red"}}>{this.state.cannot_create}</span>
            </div>
            {this.state.commentslist?this.props.history.push({pathname: '/comments', state: {discussiontopic_id: this.state.id, campaign_id:this.props.location.state.campaign_id, type:"Discussiontopics"}}):null}      
          </div>
        :this.props.history.push("/login")}
      </div>
    )
  }
}
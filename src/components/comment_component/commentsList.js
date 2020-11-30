import React from 'react'
import $ from "jquery"
import Navbar from "../navbar"
export default class CommentsList extends React.Component{
  constructor(props)
  { 
    super(props);
    this.state={
      errors:{},
      fields:{title:""},
      data:[]
    }
  }
  componentDidMount(){
    const  campaign= {id: this.props.location.state.campaign_id, type:this.props.location.state.type}
    const  discussiontopic= {id: this.props.location.state.discussiontopic_id, type:this.props.location.state.type}  
    $.ajax({
      type: "GET",
      url: 'https://reactrailsapi.herokuapp.com/comments',
      dataType: "JSON",
      data: {campaign: campaign, discussiontopic: discussiontopic },
      headers: JSON.parse(sessionStorage.user)
    }).done((data) => {
      this.setState({data:data})
    });
  }

  handleValidation(){
    let fields = this.state.fields;
    let errors=this.state.errors;
    let formIsValid=true;
    
    if(!fields["title"]){
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

      const  comment={ title: this.state.fields["title"]}
      const  campaign= {id: this.props.location.state.campaign_id, type: this.props.location.state.type}
      const  discussiontopic= {id: this.props.location.state.discussiontopic_id,type: this.props.location.state.type}  
      $.ajax({
        type: 'POST',
        url: 'https://reactrailsapi.herokuapp.com/comments',
        data: {campaign: campaign, comment:comment, discussiontopic:discussiontopic},
        headers: JSON.parse(sessionStorage.user)
      })
      .done((data) => {
        const  campaign= {id: this.props.location.state.campaign_id, type:this.props.location.state.type}
        const  discussiontopic= {id: this.props.location.state.discussiontopic_id, type:this.props.location.state.type}  
        $.ajax({
          type: "GET",
          url: 'https://reactrailsapi.herokuapp.com/comments',
          dataType: "JSON",
          data: {campaign: campaign, discussiontopic: discussiontopic },
          headers: JSON.parse(sessionStorage.user)
        }).done((data) => {
          this.setState({data:data})
        });
      })
    }
  }
  handleChange(field, e){         
    let fields = this.state.fields;
    fields[field] = e.target.value;        
    this.setState({fields});
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
                  {this.state.data.length?this.state.data.map((comment) =>
                    <div>
                       <div class="page-content page-container" id="page-content">
                      <div class="padding">
                        <div class="row">
                          <div class="col-sm-20">
                            <div class="list list-row block">
                              <div class="list-item">
                              <div class="flex"> 
                                    <div class="item-except text-muted text-sm h-1x">{comment.title}</div>
                                   </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                  ):<h3>No Comment</h3>}
                </div>
              </div>  
            </div>
            <div className="CampaignList-form-container">
            
                <form  onSubmit={(event)=>this.handleSubmit(event)}>
                  <h3 class="align_center">Add Comment</h3>  
                  <br/>
                  <div className="title" >
                    <input type="text" name="title" placeholder="Title" onChange={this.handleChange.bind(this, "title")} value={this.state.fields["name"]}  />
                    <span style={{color: "red"}}>{this.state.errors["title"]}</span>
                  </div>
                  <div>
                    <br/><br/>
                    <input type="submit"/>
                  </div>
                </form>
                </div>
              </div>
        :this.props.history.push("/login")}
      </div>
    )
  }
}
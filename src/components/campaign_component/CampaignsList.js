import React from 'react'
import $ from "jquery"
import Navbar from "../navbar"
import "../../stylesheets/tag.css"
import "./listtemplate.css"
export default class CampaignsList extends React.Component{
  state={
    data:[],
    addcampaign:false,
    discussiontopicslist:false,
    commentsList:false,
    detail:false,
    id:0,
    errors:{},
    fields:{title:"", purpose:"", estimated_duration:""},
    estimated_duration:{"within_1_week":0, "within_1_month":1, "within_3_months":2},
    tags: [
      'Tags'
    ],
    current_user:[],
    campaign:[],
    users:[],

  }
  componentDidMount(){
    $.ajax({
      type: "GET",
      url: '/campaigns',
      dataType: "JSON",
      headers: JSON.parse(sessionStorage.user)
    }).done((data) => {
      this.setState({data:data})
      $.ajax({
        type: "GET",
        url: 'https://reactrailsapi.herokuapp.com/users/Allusers',
        headers: JSON.parse(sessionStorage.user)
      }).done((data) => {
        console.log(data)
        this.setState({users:data})
      });
  });

    $.ajax({
      type: "GET",
      url: 'https://reactrailsapi.herokuapp.com/users/currentuser',
      headers: JSON.parse(sessionStorage.user)
    }).done((data) => {
      this.setState({current_user:data})
    });
  }
  removeTag = (i) => {
    const newTags = [ ...this.state.tags ];
    newTags.splice(i, 1);
    this.setState({ tags: newTags });
  }

  inputKeyDown = (e) => {
    const val = e.target.value;
    if (e.key === 'Enter' && val) {
      if (this.state.tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      this.setState({ tags: [...this.state.tags, val]});
      this.tagInput.value = null;
    } else if (e.key === 'Backspace' && !val) {
      this.removeTag(this.state.tags.length - 1);
    }
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
    if(!fields["purpose"]){
      formIsValid = false;
      errors["purpose"] = "Cannot be empty";
      }
    else
    errors["purpose"] = ""
    this.setState({errors: errors});
    return formIsValid;
  }

  handleSubmit(event)
  {
    event.preventDefault();
    if(this.handleValidation()){
      let fields = this.state.fields;
      
      const campaign= { title: fields["title"], purpose:fields["purpose"], estimated_duration:fields["estimated_duration"] }
      $.ajax({
        type: 'POST',
        url: 'https://reactrailsapi.herokuapp.com/campaigns',
        data: {campaign: campaign},
        headers: JSON.parse(sessionStorage.user)
      })
      .done((data) => {
        const  campaign= {id: data.id}
        this.state.tags.map((key)=>{
          const tag= { name: key}
          $.ajax({
            type: 'POST',
            url: 'https://reactrailsapi.herokuapp.com/tags',
            data: {tag:tag, campaign: campaign},
            headers: JSON.parse(sessionStorage.user)
          })
        })
        $.ajax({
          type: "GET",
          url: 'https://reactrailsapi.herokuapp.com/campaigns',
          dataType: "JSON",
          headers: JSON.parse(sessionStorage.user)
        }).done((data) => {
          this.setState({data})
        });
      })
    }
  }


  handleChange(field, e){         
    let fields = this.state.fields;
    fields[field] = e.target.value;        
    this.setState({fields});
  }
  SetState(id, type){
    switch(type)
    {
      case 'addcampaign': this.setState({addcampaign:true})
      break;
      case 'commentsList': this.setState({id:id, commentsList:true})
      break;
      case 'discussiontopicslist': this.setState({id:id, discussiontopicslist:true})
      break;
    }

  }
  username(id)
  {
    console.log(id)
    this.state.first_letter.filter((user)=>{if(user===id)
    console.log(user)
    })
                                  
  }
  detail(campaign){
    this.setState({detail:true,campaign})
  }
  render(){
    const { tags } = this.state;
    var {name}=""
    return(
      <div>  
          <div>
          <Navbar/>
          <div className="CampaignList-container">
            <div className="row">
              <div className="column">
                {this.state.data.length?this.state.data.map((campaign) =>
                  <div>
                    <div class="page-content page-container" id="page-content">
                      <div class="padding">
                        <div class="row">
                          <div class="col-sm-20">
                            <div class="list list-row block">
                              <div class="list-item">
                                
                                  <div class="flex"> 
                                    <div class="item-except text-muted text-sm h-1x">Title: {campaign.title }</div>
                                    <br></br>
                                    <button className="btns-distance" onClick={()=>this.detail(campaign)}>View detail</button>
                                    <button className="btns-distance" onClick={()=>this.SetState(campaign.id,"discussiontopicslist")}>Discussion Topics</button>
                                    <button className="btns-distance" onClick={()=>this.SetState(campaign.id, "commentsList")}>Comments</button>  
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                ):<h3>No Campaign</h3>}
              </div>
            </div>  
          </div>
          {this.state.current_user.user_type==="Expert"?
          <div>
            <div className="CampaignList-form-container">
            <form  onSubmit={(event)=>this.handleSubmit(event)}>
              <br/>
              <div >
                <input type="text" name="title" placeholder="Title" onChange={this.handleChange.bind(this, "title")} value={this.state.fields["name"]}  />
                <span style={{color: "red"}}>{this.state.errors["title"]}</span>
              </div>
              <div >
                <textarea  name="purpose" placeholder="Purpose" onChange={this.handleChange.bind(this, "purpose")} value={this.state.fields["purpose"]} ></textarea>
                <span style={{color: "red"}}>{this.state.errors["purpose"]}</span>
              </div>
              <div >
                <select onChange={this.handleChange.bind(this, "estimated_duration")}>
                  <option value="" disabled selected>Choose estimated duration</option>
                  {Object.keys(this.state.estimated_duration).map(key => (
                    <option key={this.state.estimated_duration[key]} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <span style={{color: "red"}}>{this.state.errors["purpose"]}</span>
              </div>
              <div className="input-tag">
                <ul className="input-tag__tags">
                  { tags.map((tag, i) => (
                    <li key={tag}>
                      {tag}
                      <button type="button" onClick={() => { this.removeTag(i); }}>x</button>
                    </li>
                  ))}
                  <li className="input-tag__tags__input"><input type="text" onKeyDown={this.inputKeyDown} ref={c => { this.tagInput = c; }} /></li>
                </ul>
              </div>
              <div>
                <br/><br/>
                <input type="submit"/>
              </div>
            </form>
            </div>
              
           </div>:null}
           {this.state.detail?this.props.history.push({pathname: '/campaign', state: {campaign: this.state.campaign}}):null}
          {this.state.addcampaign?this.props.history.push('/addcampaign'):null}
          {this.state.discussiontopicslist?this.props.history.push({pathname: '/discussiontopics', state: {campaign_id: this.state.id}}):null}
          {this.state.commentsList?this.props.history.push({pathname: '/comments', state: {discussiontopic_id:0, campaign_id: this.state.id, type:"Campaign"}}):null}
          </div>
       
      </div>
    )
  }
}

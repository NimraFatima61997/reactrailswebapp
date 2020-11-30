import React from "react" 
import $ from "jquery"
import Navbar from "../navbar"
export default class  Campaign extends React.Component
{
  state={
    data:[],
  }
  componentDidMount()
  {
    const  campaign= {id: this.props.location.state.campaign.id} 
    $.ajax({
      type: "GET",
      url: 'https://reactrailsapi.herokuapp.com/tags',
      dataType: "JSON",
      data: {campaign: campaign },
      headers: JSON.parse(sessionStorage.user)
    }).done((data) => {
      if(data){
        this.setState({data})
      }
    });
  }
  render(){
    const campaign=this.props.location.state.campaign
    return(
      <div> 
        {sessionStorage.getItem("user_signed_in")==="login"?
          <div className="Campaign_detail">
            <Navbar/>          
            <div class="page-content page-container">
              <div class="padding">
                <div class="row">
                  <div class="col-sm-20">
                    <div class="list list-row block">
                      <div class="list-item">
                        <div><a href="#" data-abc="true"><span class="w-48 avatar gd-warning">  <div>N</div></span></a></div>
                            <div class="flex"> <a href="#" class="item-author text-color" data-abc="true">{sessionStorage.getItem('user_name').toUpperCase()}</a><br></br>
                              <h3 className="inline">Title:</h3> <p className="inline">{campaign.title }</p>
                              <br></br>
                              <h3 className="inline">Purpose: </h3><p className="inline">{campaign.purpose}</p> 
                              <br></br>
                              <h3 className="inline">Estimated Duration: </h3><p className="inline">{campaign.estimated_duration}</p> 
                              <br></br>
                              <h3 className="inline">Tags:</h3>
                              {this.state.data.length!=0?
                              <ul className="input-tag__tags">
                                { this.state.data.map((tag, i) => (
                                  <li key={tag}>
                                    {tag.name}
                                  </li>
                                ))}
                              </ul>:<p className="inline">No Tag</p>}     
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        :this.props.history.push("/login")}
      </div>    
    )
  }
}
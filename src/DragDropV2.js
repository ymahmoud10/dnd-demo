import React from 'react';
import _ from 'lodash';

import './App.css';

class DragDropV2 extends React.Component {
  state = {
    places: [
      {id: "1", name: "P1", status: "unplanned"},
      {id: "2", name: "P2", status: "unplanned"},
      {id: "3", name: "P3", status: "unplanned"},
      {id: "4", name: "P4", status: "unplanned"}
    ]
  }
  
  onDragStart = (event, placeName) => {
    console.log('dragstart on div: ', placeName);
    event.dataTransfer.setData("placeName", placeName);
    this.draggedItem = event.target;
  }
  
  onDragOver = (event) => {
    event.preventDefault();
    this.draggedItem.style.visibility = 'hidden';
  }

  onDrop = (event, newStatus) => {
    let placeName = event.dataTransfer.getData("placeName");

    let places = this.state.places.filter((place) => {
        if (place.name === placeName) {
            place.status = newStatus;
        }
        return place;
    });

    this.setState({
        ...this.state,
        places
    });
  }

  render() {
    var places = {
      unplanned: [],
      planned: []
    }
    
    this.state.places.forEach ((place) => {
      console.log(place.status);
      if (place.status === 'unplanned') {
        places[place.status].push(
          <div key={place.id} 
          onDragStart = {(event) => this.onDragStart(event, place.name)}
          draggable
          className="draggable">
          {place.name}
          </div>
        );
      } else {
        console.log(places.planned);
        places.planned[place.status] = (
          <div key={place.id} 
            onDragStart = {(event) => this.onDragStart(event, place.name)}
            draggable
            className="draggable">
            {place.name}
          </div>
        );
      }
    });
    
    return (
      <div className="drag-container">
        <h2 className="head">Timeline Drag & Drop Demo</h2>
        <div className="unplanned"
          onDragOver={(event)=>this.onDragOver(event)}
          onDrop={(event)=>{this.onDrop(event, "unplanned")}}>
          <span className="group-header">Places List</span>
          {places.unplanned}
        </div>
        <div className="timeline">
          {
          _.times(24, (i) => (
            <div className="droppable" key={i}
            onDragOver={(event)=>this.onDragOver(event)}
            onDrop={(event)=>this.onDrop(event, i)}>
              <span className="group-header">{i}:00</span>
              {places.planned[i]}
            </div>
          ))
          }
        </div>
      </div>
    );
  }
}

export default DragDropV2;
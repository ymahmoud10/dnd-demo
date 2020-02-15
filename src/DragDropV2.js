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
  
  onDragStart = (event, placeId) => {
    event.dataTransfer.setData("draggedPlaceId", placeId);
    // this.draggedItem = event.target;
    console.log("Dragging:", placeId)
  }
  
  onDragOver = (event) => {
    event.preventDefault();
    // this.draggedItem.style.visibility = 'hidden'; //NOT GOOD
   }

  onDrop = (event, newStatus) => {
    console.log("Dropping on:", event.target.draggable);
    let draggedPlaceId = event.dataTransfer.getData("draggedPlaceId");
    let places = this.state.places.filter((place) => {
      if (place.status === newStatus) {
        place.status = "unplanned";
      }
      if (place.id === draggedPlaceId) {
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
      if (place.status === 'unplanned') {
        places[place.status].push(
          <div key={place.id} 
          onDragStart = {(event) => this.onDragStart(event, place.id)}
          draggable
          className="draggable">
          {place.name}
          </div>
        );
      } else {
        places.planned[place.status] = (
          <div key={place.id} 
            onDragStart = {(event) => this.onDragStart(event, place.id)}
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
          <span className="group-header">Timeline</span>
          {
          _.times(24, (i) => (
            <div className="droppable" key={i} id={i}
            onDragOver={(event)=>this.onDragOver(event)}
            onDrop={(event)=>this.onDrop(event, i)}>
              <span className="droppable-title">{i < 10 ? `0${i}`:i}:00</span>
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
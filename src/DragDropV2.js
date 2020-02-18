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
  
  onDragStart = (event, placeId, placeStatus) => {
    event.dataTransfer.setData("draggedPlaceId", placeId);
    event.dataTransfer.setData("draggedPlaceStatus", placeStatus);
    // this.draggedItem = event.target;
  }
  
  onDragOver = (event) => {
    event.preventDefault();
    // this.draggedItem.style.visibility = 'hidden'; //NOT GOOD
   }

  onDrop = (event, newStatus, isParent) => {
    //Handling event bubbling
    if (!isParent) {
      this.childCalled = true;
    } else if (this.childCalled) {
      // isParent && childCalled => won't go through
      this.childCalled = undefined;
      return;
    }

    let draggedPlaceId = event.dataTransfer.getData("draggedPlaceId");
    let draggedPlaceStatus = Number.parseInt(event.dataTransfer.getData("draggedPlaceStatus"));

    let places = this.state.places.filter((place) => {
      if (place.status === newStatus && place.status !== "unplanned") {
        // Target has place already
        place.status = draggedPlaceStatus;
      }
      if (place.id === draggedPlaceId) {
        // Changing dragged place status
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
          onDragStart = {(event) => this.onDragStart(event, place.id, place.status)}
          draggable
          className="draggable">
          {place.name}
          </div>
        );
      } else {
        places.planned[place.status] = (
          <div key={place.id} 
            onDragStart = {(event) => this.onDragStart(event, place.id, place.status)}
            draggable
            className="draggable">
            {place.name}
          </div>
        );
      }
    });
    
    return (
      <div className="drag-container"
        onDragOver={(event)=>this.onDragOver(event)}
        onDrop={(event)=>{this.onDrop(event, "unplanned", true)}}>
        <h2 className="head">Timeline Drag & Drop Demo</h2>
        <div className="unplanned">
          <span className="group-header">Places List</span>
          {places.unplanned}
        </div>
        <div className="timeline">
          <span className="group-header">Timeline</span>
          {
          _.times(24, (i) => (
            <div className="droppable" key={i} id={i}
            onDragOver={(event)=>this.onDragOver(event)}
            onDrop={(event)=>this.onDrop(event, i, false)}>
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
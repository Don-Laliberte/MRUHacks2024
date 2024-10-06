import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Card = ({ item, index, onClick }) => (
  <Draggable key={item.id} draggableId={item.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`card ${snapshot.isDragging ? 'dragging' : ''}`}
        onClick={onClick}
      >
        <div className="card-title">{item.title}</div>
      </div>
    )}
  </Draggable>
);

export default Card;
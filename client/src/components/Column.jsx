import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card';

const Column = ({ column, columnId, onCardClick, onAddCard, onTitleClick, editingColumnId, onTitleChange, onTitleBlur, onTitleKeyDown }) => (
  <div className="column">
    <div className="column-header">
      {editingColumnId === columnId ? (
        <input
          type="text"
          value={column.title}
          onChange={(e) => onTitleChange(columnId, e.target.value)}
          onBlur={onTitleBlur}
          onKeyDown={(e) => onTitleKeyDown(e, columnId)}
          autoFocus
          className="column-title-input"
        />
      ) : (
        <h2 
          onClick={() => onTitleClick(columnId)}
          className="column-title"
        >
          {column.title}
        </h2>
      )}
      <button className="icon-button" onClick={() => onAddCard(columnId)}>+</button>
    </div>
    
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          className={`cards-container ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {column.items.map((item, index) => (
            <Card 
              key={item.id} 
              item={item} 
              index={index} 
              onClick={() => onCardClick(columnId, item)}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

export default Column;
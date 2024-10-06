import React, { useState, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import Box from "@mui/material/Box";
import '../assets/KanbanStyles.css';

const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`;

const createItem = (title, description, timeEstimate) => ({
  id: generateId(),
  title,
  description,
  timeEstimate
});

export default function KanbanBoard() {
  const [columns, setColumns] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [editingColumnId, setEditingColumnId] = useState(null);

  const addColumn = () => {
    if (Object.keys(columns).length >= 6) return;

    const newColumnId = generateId();
    setColumns(prev => ({
      ...prev,
      [newColumnId]: {
        id: newColumnId,
        title: `New Column`,
        items: []
      }
    }));
  };

  const onDragEnd = useCallback((result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setColumns(prevColumns => {
      const newColumns = { ...prevColumns };
      const sourceColumn = newColumns[source.droppableId];
      const destColumn = newColumns[destination.droppableId];
      const [removed] = sourceColumn.items.splice(source.index, 1);
      destColumn.items.splice(destination.index, 0, removed);
      return newColumns;
    });
  }, []);

  const addCard = useCallback((columnId) => {
    const newCard = createItem('New Task', 'Click to edit', '1h');

    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: [...prev[columnId].items, newCard]
      }
    }));
  }, []);

  const handleCardClick = (columnId, card) => {
    setSelectedCard(prev => prev && prev.id === card.id ? null : { ...card, columnId });
  };

  const updateColumnTitle = (columnId, newTitle) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        title: newTitle
      }
    }));
  };

  const handleColumnTitleClick = (columnId) => {
    setEditingColumnId(columnId);
  };

  const handleColumnTitleBlur = () => {
    setEditingColumnId(null);
  };

  const handleColumnTitleKeyDown = (e, columnId) => {
    if (e.key === 'Enter') {
      setEditingColumnId(null);
    }
  };

  const updateColumns = (newNumColumns) => {
    const currentColumns = Object.entries(columns);
    const updatedColumns = {};
    
    // Limit the number of columns to 6
    const limitedNumColumns = Math.min(newNumColumns, 6);
    
    for (let i = 0; i < limitedNumColumns; i++) {
      if (i < currentColumns.length) {
        updatedColumns[currentColumns[i][0]] = currentColumns[i][1];
      } else {
        const newColumnId = `column${i + 1}`;
        updatedColumns[newColumnId] = {
          id: newColumnId,
          title: `Column ${i + 1}`,
          items: []
        };
      }
    }
    
    setColumns(updatedColumns);
    setNumColumns(limitedNumColumns);
  };

  return (
    <Box className="kanban-container">
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Box className="columns-container">
          {Object.entries(columns).map(([columnId, column]) => (
            <Column
              key={columnId}
              column={column}
              columnId={columnId}
              onCardClick={handleCardClick}
              onAddCard={addCard}
              onTitleClick={handleColumnTitleClick}
              editingColumnId={editingColumnId}
              onTitleChange={updateColumnTitle}
              onTitleBlur={handleColumnTitleBlur}
              onTitleKeyDown={handleColumnTitleKeyDown}
            />
          ))}
          {Object.keys(columns).length < 6 && (
            <button className="add-column-button" onClick={addColumn}>+</button>
          )}
        </Box>
      </DragDropContext>

      {Object.keys(columns).length === 0 && (
        <Box className="empty-board" onClick={addColumn}>
          <Box className="large-plus">+</Box>
        </Box>
      )}

      {/* Sidebar for Card Details */}
      <Box className={`sidebar ${selectedCard ? 'open' : ''}`}>
        {/* ... existing sidebar code ... */}
      </Box>
    </Box>
  );
}
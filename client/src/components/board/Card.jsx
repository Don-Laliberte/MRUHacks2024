import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Paper, Typography } from '@mui/material';

const Card = ({ item, index, onClick }) => (
  <Draggable key={item.id} draggableId={item.id} index={index}>
    {(provided, snapshot) => (
      <Paper
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        elevation={snapshot.isDragging ? 6 : 1}
        sx={{
          p: 2.5,
          mb: 1,
          backgroundColor: snapshot.isDragging ? 'action.selected' : 'background.paper',
          border: 'thick double',
          borderColor: snapshot.isDragging ? 'primary.main' : 'black',
          '&:hover': {
            backgroundColor: 'action.hover',
            borderColor: 'primary.light',
          },
        }}
        onClick={onClick}
      >
        <Typography variant="body3">{item.title}</Typography>
      </Paper>
    )}
  </Draggable>
);

export default Card;
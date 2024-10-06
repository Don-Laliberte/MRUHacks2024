import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Paper, Typography, IconButton, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Card from './Card';

export default function Column({ 
  column, 
  columnId, 
  onCardClick, 
  onAddCard, 
  onTitleClick, 
  editingColumnId, 
  onTitleChange, 
  onTitleBlur, 
  onTitleKeyDown, 
  width 
}) {
  return (
    <Box
      sx={{
        width: width,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
      }}
    >
      <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', width: width, minWidth: 200 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          {editingColumnId === columnId ? (
            <TextField
              value={column.title}
              onChange={(e) => onTitleChange(columnId, e.target.value)}
              onBlur={onTitleBlur}
              onKeyDown={(e) => onTitleKeyDown(e, columnId)}
              autoFocus
              variant="standard"
              fullWidth
            />
          ) : (
            <Typography
              onClick={() => onTitleClick(columnId)}
              sx={{ cursor: 'pointer', flexGrow: 1, mr: 1 }}
            >
              <Box variant="h6">
                {column.title}
              </Box>
            </Typography>
          )}
          <IconButton onClick={() => onAddCard(columnId)} size="small">
            <AddIcon />
          </IconButton>
        </Box>
        
        <Droppable droppableId={columnId}>
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                flexGrow: 1,
                minHeight: 100,
                backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'background.default',
                transition: 'background-color 0.2s ease',
                p: 1,
                overflowY: 'auto',
              }}
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
            </Box>
          )}
        </Droppable>
      </Paper>
    </Box>
  );
}
import React, { useState, useCallback, useRef, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import {
  Box,
  Typography,
  Container,
  Drawer,
  TextField,
  IconButton,
  Fab,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Column from './Column';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';


const COLUMN_WIDTH = 280; // Fixed width for columns
const COLUMN_GAP = 24; // Gap between columns

const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`;

const createItem = (title, description = "", timeEstimate = "") => ({
  id: generateId(),
  title,
  description,
  timeEstimate,
});

const initialColumns = {
  todo: {
    id: "todo",
    title: "To Do",
    items: [],
  },
  workingOn: {
    id: "workingOn",
    title: "Working On",
    items: [],
  },
  done: {
    id: "done",
    title: "Done",
    items: [],
  },
};

export default function KanbanBoard(aiData) {
  const [columns, setColumns] = useState(initialColumns);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  const columnCount = Object.keys(columns).length;
  const totalColumnWidth =
    columnCount * COLUMN_WIDTH + (columnCount - 1) * COLUMN_GAP;
  const shouldShrink = totalColumnWidth > containerWidth;
  const adjustedColumnWidth = shouldShrink
    ? (containerWidth - (columnCount - 1) * COLUMN_GAP) / columnCount
    : COLUMN_WIDTH;

  const addColumn = () => {
    if (Object.keys(columns).length >= 6) return;

    const newColumnId = generateId();
    setColumns((prev) => ({
      ...prev,
      [newColumnId]: {
        id: newColumnId,
        title: "New Column",
        items: [],
      },
    }));
  };

  function addAiColumn(id) {
    if (Object.keys(columns).length >= 6) return;

    setColumns((prev) => ({
      ...prev,
      [id]: {
        id: id,
        title: "Ai Tasks",
        items: [],
      },
    }));
  }

  function appendColumn(data) {
    if (Object.keys(columns).length >= 7) return;

    setColumns((prev) => ({
      ...prev,
      [data.id]: {
        id: data.id,
        title: data.title,
        items: data.items,
      },
    }));
  }

  const removeColumn = () => {
    if (Object.keys(columns).length <= 0) return;

    setColumns((prev) => {
      const newColumns = { ...prev };
      const lastColumnId = Object.keys(newColumns).pop();
      delete newColumns[lastColumnId];
      return newColumns;
    });
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

    setColumns((prevColumns) => {
      const newColumns = { ...prevColumns };
      const sourceColumn = newColumns[source.droppableId];
      const destColumn = newColumns[destination.droppableId];
      const [removed] = sourceColumn.items.splice(source.index, 1);
      destColumn.items.splice(destination.index, 0, removed);
      return newColumns;
    });
  }, []);

  const addCard = useCallback((columnId) => {
    const newCard = createItem(
      "New Task",
      "Click to edit",
      "Start Date",
      "End Date"
    );

    setColumns((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: [...prev[columnId].items, newCard],
      },
    }));
  }, []);

  function addAiCard(columnId, title, desc, startTime, endTime) {
    const newCard = createItem(title, desc, startTime, endTime);

    setColumns((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: [...prev[columnId].items, newCard],
      },
    }));
  }

  const handleCardClick = (columnId, card) => {
    setSelectedCard((prev) =>
      prev && prev.id === card.id ? null : { ...card, columnId }
    );
  };

  const updateCard = (columnId, cardId, updatedCard) => {
    setColumns((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: prev[columnId].items.map((item) =>
          item.id === cardId ? { ...item, ...updatedCard } : item
        ),
      },
    }));
    setSelectedCard(null);
  };

  const handleColumnTitleClick = (columnId) => {
    setEditingColumnId(columnId);
  };

  const handleColumnTitleBlur = () => {
    setEditingColumnId(null);
  };

  const handleColumnTitleKeyDown = (e, columnId) => {
    if (e.key === "Enter") {
      setEditingColumnId(null);
    }
  };

  const updateColumnTitle = (columnId, newTitle) => {
    setColumns((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        title: newTitle,
      },
    }));
  };

  const deleteCard = useCallback((columnId, cardId) => {
    setColumns((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: prev[columnId].items.filter((item) => item.id !== cardId),
      },
    }));
    setSelectedCard(null);
  }, []);

  const addAiData = () => {
    if (aiData != null) {
      let placeHolderColumns = columns;
      setColumns(null);
      let newColumnId = generateId();
      addAiColumn(newColumnId);
      appendColumn(placeHolderColumns);
      console.log(aiData);
      aiData.map(data => addAiCard(newColumnId,data.summary,"Click to Edit", data.start, data.end));
    }
  };

  return (
    <Container maxWidth={false} disableGutters ref={containerRef}>
      <Box
        sx={{
          height: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          pt: 2,
          pb: 4,
        }}
      >
        {Object.keys(columns).length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100vh - 164px)",
              cursor: "pointer",
              width: "100%",
            }}
            onClick={addColumn}
          >
            <AddIcon sx={{ fontSize: 100, color: "text.secondary" }} />
          </Box>
        ) : (
          <Box sx={{ height: "calc(100% - 48px)", overflow: "auto" }}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Box
                sx={{
                  marginRight: "10%",
                  marginLeft: "2.5%",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  gap: `${COLUMN_GAP}px`,
                  pb: 2,
                  width: shouldShrink ? "100%" : "auto",
                }}
              >
                {Object.entries(columns).map(([columnId, column]) => (
                  <Box
                    key={columnId}
                    sx={{
                      height: "100%",
                      flexShrink: 0,
                      width: adjustedColumnWidth,
                    }}
                  >
                    <Column
                      column={column}
                      columnId={columnId}
                      onCardClick={handleCardClick}
                      onAddCard={addCard}
                      onTitleClick={handleColumnTitleClick}
                      editingColumnId={editingColumnId}
                      onTitleChange={updateColumnTitle}
                      onTitleBlur={handleColumnTitleBlur}
                      onTitleKeyDown={handleColumnTitleKeyDown}
                      width={adjustedColumnWidth}
                    />
                  </Box>
                ))}
              </Box>
            </DragDropContext>
          </Box>
        )}

        <Box
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {Object.keys(columns).length < 6 &&
            Object.keys(columns).length > 0 && (
              <Fab
                color="primary"
                size="large"
                aria-label="add"
                onClick={addColumn}
              >
                <AddIcon sx={{ fontSize: 36 }} />
              </Fab>
            )}
          {Object.keys(columns).length > 0 && (
            <Fab
              color="secondary"
              size="large"
              aria-label="remove"
              onClick={removeColumn}
            >
              <RemoveIcon sx={{ fontSize: 36 }} />
            </Fab>
          )}
          {Object.keys(columns).length > 0 && (
            <Fab
              color="third"
              size="large"
              aria-label="remove"
              onClick={addAiData}
            >
              <ReplyAllIcon sx={{ fontSize: 36 }} />
            </Fab>
          )}
        </Box>

        <Drawer
          anchor="right"
          open={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        >
          <Box sx={{ width: 300, p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Edit Card</Typography>
              <IconButton onClick={() => setSelectedCard(null)}>
                <CloseIcon />
              </IconButton>
            </Box>
            {selectedCard && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateCard(
                    selectedCard.columnId,
                    selectedCard.id,
                    selectedCard
                  );
                }}
              >
                <TextField
                  fullWidth
                  label="Title"
                  value={selectedCard.title}
                  onChange={(e) =>
                    setSelectedCard({ ...selectedCard, title: e.target.value })
                  }
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={selectedCard.description}
                  onChange={(e) =>
                    setSelectedCard({
                      ...selectedCard,
                      description: e.target.value,
                    })
                  }
                  margin="normal"
                  multiline
                  rows={4}
                />
                <TextField
                  fullWidth
                  label="Start Estimate"
                  value={selectedCard.timeEstimate}
                  onChange={(e) =>
                    setSelectedCard({
                      ...selectedCard,
                      startEstimate: e.target.value,
                    })
                  }
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="End Estimate"
                  value={selectedCard.timeEstimate}
                  onChange={(e) =>
                    setSelectedCard({
                      ...selectedCard,
                      endEstimate: e.target.value,
                    })
                  }
                  margin="normal"
                />
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setSelectedCard(null)}
                    >
                      Cancel
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    color="error"
                    label="Delete"
                    onClick={() =>
                      deleteCard(selectedCard.columnId, selectedCard.id)
                    }
                  >
                    Delete
                  </Button>
                </Box>
              </form>
            )}
          </Box>
        </Drawer>
      </Box>
    </Container>
  );
}

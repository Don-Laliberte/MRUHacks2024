import { Modal } from "@mui/material/Modal";
import { Typography } from "@mui/material/Typography";
import { Countdown } from "./Countdown";

export default function CountdownModal(open, toggleTimerModal) {

    return (
        <Modal
          open={open}
          onClose={toggleTimerModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Countdown></Countdown>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal>
    );
}

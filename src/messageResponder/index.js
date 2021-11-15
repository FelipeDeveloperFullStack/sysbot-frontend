import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField'
import InputBase from '@material-ui/core/InputBase';
/** Icons */
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
/** Semantic */
import { Message } from 'semantic-ui-react'

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function MessageResponderDialog(props) {

  const [message, setMessage] = React.useState('')

  const handleClose = () => {
    props.setVisible(false)
  }

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={props.visible} fullWidth maxWidth={'md'}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Responder ao {props.displayName}
          <Message warning style={{ fontSize: '10px' }}>
            <Message.Header>Observação</Message.Header>
            <p>Apesar da mensagem ser extraída do grupo <b>{props.chatName}</b>, a resposta será enviada no privado para essa pessoa.</p>
          </Message>
        </DialogTitle>
        <DialogContent id='dialogID' dividers >
          <InputBase value={props.body} multiline size='small' style={{ maxWidth: '90%', minWidth: '90%' }} />
        </DialogContent>
        <div>
          <TextField value={message} onChange={(event) => setMessage(event.target.value)} multiline label="Digite aqui sua resposta [Utilize a tecla ENTER para pular de linha]" variant="filled" size='small' fullWidth/>
        </div>
        <DialogActions>
          <Button variant='contained' onClick={() => props.responderMenssage({ data: { props, message }})} color="primary" size='small' startIcon={<SendIcon />}>Enviar resposta</Button>
          <Button variant='contained' onClick={handleClose} color="secondary" size='small' startIcon={<SettingsBackupRestoreIcon />}>Voltar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

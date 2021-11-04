import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import DataGrid from '../datagrid'
/** Icon */
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
/** Services Api */
import { getApi } from '../services/api'

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
})

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent)

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions)

export default function DialogKeyWords(props) {

  const [words, setWords] = React.useState([])

  const handleClose = () => {
    props.setVisible(false)
  }

  useEffect(() => {
    getKeyWords()
  },[])

  const getKeyWords = async () => {
    let result = await getApi({ url: 'key_words' })
    setWords(tratarDados({ dados: result.data }))
  }

  const tratarDados = ({ dados }) => {
    let dadosTemp = []
    Array.from(dados).forEach((value, index) => {
      dadosTemp.push({
        id: index + 1,
        word: value
      })
    })
    return dadosTemp
  }

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={props.visible} fullWidth maxWidth={'xs'}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Gerenciamento de palavras chaves
        </DialogTitle>
        <DialogContent dividers>
          <DataGrid words={words}/>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleClose} color="primary" startIcon={<CheckCircleIcon/>}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

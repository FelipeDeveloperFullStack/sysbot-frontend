import React, { useEffect, useRef } from 'react'
import './App.css'
import clsx from 'clsx'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import { DrawerStyled } from './sidebar/style'
import 'semantic-ui-css/semantic.min.css'
import { iniciarConexaoWhatsapp } from './services/auth'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { listStatusMessageData } from './messageData'
import MobileOffIcon from '@material-ui/icons/MobileOff'
import MobileFriendlyIcon from '@material-ui/icons/MobileFriendly'
import SpellcheckIcon from '@material-ui/icons/Spellcheck'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import DialogKeyWords from './dialogKeyWords'
import Tootip from '@material-ui/core/Tooltip'
/** Primeface React */
import MessageUser from './messageUser'
import QRCodeAuth from './qrcodeAuth'
import _ from 'lodash'

/** Socket */
import socketIO from 'socket.io-client'

import MessageContent from './messageContent'

const drawerWidth = 200

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appTopBar: {
    backgroundColor: '#00BFA5',
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    elevation: 5
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: '75px',
    backgroundColor: '#00BFA5',
    display: 'flex',
    justifyContent: 'center'
  }
}))

function App() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [openShowMessage, setOpenShowMessage] = React.useState(false)
  const [openShowMessageSocketNotificationIsOpen, setOpenShowMessageSocketNotificationIsOpen] = React.useState(false)
  const [openShowMessageSocketNotificationMessage, setOpenShowMessageSocketNotificationMessage] = React.useState({ message: '' })
  const toast = useRef(null)
  /** Socket State */
  const [socketQrCode, setSocketQrCode] = React.useState({ qr_code_base64: null })
  const [socketAllMessages, setSocketAllMessages] = React.useState([])
  const [socketStatusSession, setSocketStatusSession] = React.useState({ statusSession: null })
  const [statusSessionMessageButtom, setStatusSessionMessageButtom] = React.useState(null)
  const [isVisibleDialogKeyWords, setIsVisibleKeyWords] = React.useState(false)
  let listStatus = ['notLogged', 'browserClose', 'qrReadFail', 'autocloseCalled', 'desconnectedMobile', 'deleteToken', 'deviceNotConnected', 'serverWssNotConnected', 'noOpenBrowser']
  let listStatusSuccess = ['isLogged','qrReadSuccess','chatsAvailable']

  useEffect(() => {
    const socket = socketIO(process.env.REACT_APP_URL)
    socket.on('socket_whatsapp', data => {
      setSocketQrCode({
        ...socketQrCode,
        qr_code_base64: data.qr_code_base64
      })
    })

    socket.on('socket_whatspp_status_session', data => {
      setSocketStatusSession({
        ...socketStatusSession,
        statusSession: data.statusSession
      })
    })

    socket.on('newMessageWp', data => {
      setOpenShowMessageSocketNotificationIsOpen(true)
      setOpenShowMessageSocketNotificationMessage({ message: 'Nova mensagem capturada.' })
    })

    socket.on('allMessagesWp', data => {
      data = _.reverse(data)
      setSocketAllMessages(data)
    })

    console.log({env: process.env.REACT_APP_URL})

    localStorage.setItem('statusSessionMessageButtom', JSON.stringify(false))
    // CLEAN UP THE EFFECT
    return () => socket.disconnect()
  }, [])

  useEffect(() => {
    const socket = socketIO(process.env.REACT_APP_URL)
    socket.on('allMessagesWp', data => {
      data = _.reverse(data)
      setSocketAllMessages(data)
    })
  },[listStatusSuccess.includes(socketStatusSession.statusSession)])

  const onClickIniciarConexaoWhatsapp = async () => {
    localStorage.setItem('statusSessionMessageButtom', JSON.stringify(true))
    setStatusSessionMessageButtom(true)

    await iniciarConexaoWhatsapp()

    localStorage.setItem('statusSessionMessageButtom', JSON.stringify(false))
    let resultItemLocalStorage = localStorage.getItem('statusSessionMessageButtom')
    resultItemLocalStorage = JSON.parse(localStorage.getItem('statusSessionMessageButtom'))
    setStatusSessionMessageButtom(resultItemLocalStorage)
  }

  return (
    <div>
      <Grid container>
        <Grid>
          <DrawerStyled
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
          >
            <List style={{ position: 'relative', left: '8px', display: 'flex', flexDirection: 'column' }}>
              <ListItem button onClick={() => setIsVisibleKeyWords(true)}>
                <Tootip title='Clique aqui para gerenciar as palavras chaves!'>
                  <ListItemIcon>
                    <SpellcheckIcon style={{ fontSize: '42px', position: 'relative', right: '6px', color: 'white' }} />
                  </ListItemIcon>
                </Tootip>
              </ListItem>
            </List>
          </DrawerStyled>
        </Grid>
        <Grid item xs={8}>
          <Paper style={{ margin: '9px', height: '580px', width: '90vw' }} elevation={3}>
            <div className={classes.appTopBar}>
              <AppBar position="static" className={classes.appTopBar}>
                <Toolbar>

                  {(listStatus.includes(socketStatusSession.statusSession) || !socketStatusSession.statusSession) ?
                    <MobileOffIcon style={{ color: 'black', position: 'relative', right: '6px', fontSize: '48px' }} /> :
                    <MobileFriendlyIcon style={{ color: 'white', position: 'relative', right: '6px', fontSize: '48px' }} />}

                  <Typography variant="h6" className={classes.title}>
                    {listStatusMessageData[socketStatusSession.statusSession]}
                  </Typography>

                  <Typography variant="h6">
                    SysBot Whatsapp
                  </Typography>

                </Toolbar>
              </AppBar>
            </div>
            {(listStatus.includes(socketStatusSession.statusSession) || !socketStatusSession.statusSession) &&
              <QRCodeAuth qr_code_base64={socketQrCode.qr_code_base64}
                statusSession={socketStatusSession.statusSession}
                statusSessionMessageButtom={statusSessionMessageButtom}
                setStatusSessionMessageButtom={setStatusSessionMessageButtom}
                onClickIniciarConexaoWhatsapp={onClickIniciarConexaoWhatsapp} />
            }
            <main style={{
              overflowY: 'scroll',
              height: '500px'
            }}>
              {console.log({ status: socketStatusSession.statusSession })}
              {listStatusSuccess.includes(socketStatusSession.statusSession) && <MessageContent messages={socketAllMessages}/>}
            </main>
          </Paper>
        </Grid>
      </Grid>

      {isVisibleDialogKeyWords && 
      <DialogKeyWords
        visible={isVisibleDialogKeyWords}
        setOpenShowMessage={setOpenShowMessage}
        setVisible={setIsVisibleKeyWords} />}

      {openShowMessage && <MessageUser open={openShowMessage} setOpen={setOpenShowMessage} severity={'success'} message={'Atualizado!'} />}
      {openShowMessageSocketNotificationIsOpen && <MessageUser open={openShowMessageSocketNotificationIsOpen} setOpen={setOpenShowMessageSocketNotificationIsOpen} severity={'info'} message={openShowMessageSocketNotificationMessage.message} />}
    </div>
  )
}

export default App

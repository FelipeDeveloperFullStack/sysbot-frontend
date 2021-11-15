import React, { useEffect, useRef } from 'react'
import './App.css'
/** Components */
import clsx from 'clsx'
import { DrawerStyled } from './sidebar/style'
import MessageContent from './messageContent'
import { listStatusMessageData } from './messageData'
import DialogKeyWords from './dialogKeyWords'
/** Services */
import { iniciarConexaoWhatsapp } from './services/auth'
import { postApi, getApi } from './services/api'
/** Semantic */
import 'semantic-ui-css/semantic.min.css'
/** Material UI */
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MobileOffIcon from '@material-ui/icons/MobileOff'
import MobileFriendlyIcon from '@material-ui/icons/MobileFriendly'
import SpellcheckIcon from '@material-ui/icons/Spellcheck'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Battery50 from '@material-ui/icons/BatteryCharging50';
import Battery20 from '@material-ui/icons/BatteryCharging20';
import Battery5 from '@material-ui/icons/BatteryAlert';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import ServerOnline from '@material-ui/icons/CloudQueue';
import ServerOffline from '@material-ui/icons/CloudOff';
import Tootip from '@material-ui/core/Tooltip'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress'
/** Primeface React */
import MessageUser from './messageUser'
import QRCodeAuth from './qrcodeAuth'
import _ from 'lodash'
/** Components */
import MessageResponder from './messageResponder'
/** Socket */
import socketIO from 'socket.io-client'
/** Alert */
import alert from 'sweetalert'

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function App() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [openShowMessage, setOpenShowMessage] = React.useState(false)
  const [openShowMessageSocketNotificationIsOpen, setOpenShowMessageSocketNotificationIsOpen] = React.useState(false)
  const [openShowMessageSocketNotificationMessage, setOpenShowMessageSocketNotificationMessage] = React.useState({ message: '' })
  const [isShowLinerProgress, setIsShowLineProgress] = React.useState(false)
  /** Socket State */
  const [socketQrCode, setSocketQrCode] = React.useState({ qr_code_base64: null })
  const [socketAllMessages, setSocketAllMessages] = React.useState([])
  const [socketAllTodayMessages, setSocketAllTodayMessages] = React.useState([])
  const [socketStatusSession, setSocketStatusSession] = React.useState({ statusSession: null })
  const [socketStatusBatteryChange, setSocketStatusBatteryChange] = React.useState({ battery: null, plugged: null })
  const [statusSessionMessageButtom, setStatusSessionMessageButtom] = React.useState(null)
  const [isServerOnline, setIsServerOnline] = React.useState(true)
  const [isVisibleDialogKeyWords, setIsVisibleKeyWords] = React.useState(false)
  let listStatus = ['notLogged', 'browserClose', 'qrReadFail', 'autocloseCalled', 'desconnectedMobile', 'deleteToken', 'deviceNotConnected', 'serverWssNotConnected', 'noOpenBrowser']
  let listStatusSuccess = ['isLogged', 'qrReadSuccess', 'chatsAvailable']
  const [visibleDialogResponder, setVisibleDialogResponder] = React.useState(false)
  const [data, setData] = React.useState()
  const [valueTab, setValueTab] = React.useState(0);

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

    socket.on('socket_whatspp_change_battery', data => {
      setSocketStatusBatteryChange({
        battery: data.battery,
        plugged: data.plugged
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
    // socket.on('allMessagesToday', data => {
    //   data = _.reverse(data)
    //   setSocketAllTodayMessages(data)
    // })

    localStorage.setItem('statusSessionMessageButtom', JSON.stringify(false))

    /** Check Status */
    checkStatus()
    // Check Server is Online
    checkServerIsOnline()

    // CLEAN UP THE EFFECT
    return () => socket.disconnect()
  }, [])

  // useEffect(() => {
  //   const socket = socketIO(process.env.REACT_APP_URL)
  //   socket.on('allMessagesWp', data => {
  //     data = _.reverse(data)
  //     setSocketAllMessages(data)
  //   })
  // }, [listStatusSuccess.includes(socketStatusSession.statusSession)])

  const checkStatus = async () => {
    await getApi({ url: '/check_status' })
    // socket.ont('checkStatus', (data) => {
    //   console.log({ isConnected: data })
    // })
  }

  const checkServerIsOnline = async () => {
    setInterval(async () => {
      getApi({ url: '/check_server_isonline' }).then(result => {
        setIsServerOnline(result.data.isOnline)
      }).catch(error => {
        setIsServerOnline(false)
      })
    }, 5000)
  }

  const handleButtonResponder = ({ data }) => {
    setVisibleDialogResponder(true)
    setData(data)
  }

  const logout = async () => {
    await getApi({ url: '/logout' })
  }

  const onClickIniciarConexaoWhatsapp = async () => {
    localStorage.setItem('statusSessionMessageButtom', JSON.stringify(true))
    setStatusSessionMessageButtom(true)

    await iniciarConexaoWhatsapp()

    localStorage.setItem('statusSessionMessageButtom', JSON.stringify(false))
    let resultItemLocalStorage = localStorage.getItem('statusSessionMessageButtom')
    resultItemLocalStorage = JSON.parse(localStorage.getItem('statusSessionMessageButtom'))
    setStatusSessionMessageButtom(resultItemLocalStorage)
  }

  const responderMenssage = async ({ data }) => {

    try {
      setVisibleDialogResponder(false)
      await postApi({ url: '/responder/whatsapp', data })
      alert('Mensagem enviada para o destinatário!', '', 'success')
    } catch (error) {
      alert('Ops! :( Um erro ocorreu! Não foi possível enviar sua mensagem!', error, 'error')
      console.error(error)
    }
  }

  const handleChangeTab = async (event, newValue) => {
    setValueTab(newValue)
    if (newValue === 0) {
      setIsShowLineProgress(true)
      await getApi({ url: '/find_by_date' })
      setIsShowLineProgress(false)
    }
    if (newValue === 1) {
      setIsShowLineProgress(true)
      await getApi({ url: '/listAllMessage' })
      setIsShowLineProgress(false)
    }
  };

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
              <ListItem>
                <Tootip title={isServerOnline ? 'Bot funcionando! :)' : 'Ops! O bot por algum motivo não está funcionando! Reinicie o servidor!'}>
                  <ListItemIcon style={{ display: 'flex', flexDirection: 'column' }}>
                    {isServerOnline && <ServerOnline style={{ fontSize: '42px', position: 'relative', right: '6px', color: 'white' }} />}
                    {!isServerOnline && <ServerOffline style={{ fontSize: '42px', position: 'relative', right: '6px', color: 'red' }} />}
                    <div style={{ position: 'relative', left: '5px', bottom: '6px', fontSize: '12px', fontWeight: 'bold' }}>{isServerOnline ? 'On' : 'Off'}</div>
                  </ListItemIcon>
                </Tootip>
              </ListItem>
              {socketStatusBatteryChange.battery && socketStatusBatteryChange.battery <= 50 &&
                <ListItem>
                  <Tootip title={`Atenção a bateria do seu smartphone está com ${socketStatusBatteryChange.battery}%`}>
                    <ListItemIcon style={{ display: 'flex', flexDirection: 'column' }}>
                      {(socketStatusBatteryChange.battery > 20 && socketStatusBatteryChange.battery <= 50) && <Battery50 style={{ fontSize: '42px', position: 'relative', right: '6px', color: 'white' }} />}
                      {(socketStatusBatteryChange.battery > 10 && socketStatusBatteryChange.battery <= 20) && <Battery20 style={{ fontSize: '42px', position: 'relative', right: '6px', color: 'white' }} />}
                      {(socketStatusBatteryChange.battery > 1 && socketStatusBatteryChange.battery <= 10) && <Battery5 style={{ fontSize: '42px', position: 'relative', right: '6px', color: 'white' }} />}
                      <div style={{ position: 'relative', left: '5px', bottom: '6px', fontSize: '12px', fontWeight: 'bold' }}>{socketStatusBatteryChange.battery}%</div>
                    </ListItemIcon>
                  </Tootip>
                </ListItem>}
              {!socketStatusSession.statusSession || socketStatusSession.statusSession === 'isLogged' &&
                <ListItem button onClick={logout}>
                  <Tootip title='Clique aqui para desconectar do Whatsapp'>
                    <ListItemIcon>
                      <PowerSettingsNewIcon style={{ fontSize: '42px', position: 'relative', right: '6px', color: 'black' }} />
                    </ListItemIcon>
                  </Tootip>
                </ListItem>}
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
              {!socketStatusSession.statusSession || socketStatusSession.statusSession === 'isLogged' &&
                <Tabs value={valueTab} onChange={handleChangeTab} aria-label="simple tabs example">
                  <Tab label="Mensagens de hoje" />
                  <Tab label="Todas as mensagens" />
                </Tabs>}
              <TabPanel value={valueTab} index={0}>
                 <MessageContent messages={socketAllMessages} handleButtonResponder={handleButtonResponder} />
              </TabPanel>
              <TabPanel value={valueTab} index={1}>
                {isShowLinerProgress ? <LinearProgress /> : <MessageContent messages={socketAllMessages} handleButtonResponder={handleButtonResponder} />}
              </TabPanel>
            </main>
          </Paper>
        </Grid>
      </Grid>

      {isVisibleDialogKeyWords &&
        <DialogKeyWords
          visible={isVisibleDialogKeyWords}
          setOpenShowMessage={setOpenShowMessage}
          setVisible={setIsVisibleKeyWords} />}

      {visibleDialogResponder && <MessageResponder responderMenssage={responderMenssage} visible={visibleDialogResponder} setVisible={setVisibleDialogResponder} {...data} />}
      {openShowMessage && <MessageUser open={openShowMessage} setOpen={setOpenShowMessage} severity={'success'} message={'Atualizado!'} />}
      {openShowMessageSocketNotificationIsOpen && <MessageUser open={openShowMessageSocketNotificationIsOpen} setOpen={setOpenShowMessageSocketNotificationIsOpen} severity={'info'} message={openShowMessageSocketNotificationMessage.message} />}
    </div>
  )
}

export default App

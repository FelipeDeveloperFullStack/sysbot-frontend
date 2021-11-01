import React, { useEffect } from 'react'
import Button from '@material-ui/core/Button'
import MobileOffIcon from '@material-ui/icons/MobileOff'
import { Message } from 'semantic-ui-react'


export default function QrCodeAuth(props) {

  const [messageButton, setMessageButton] = React.useState(false)

  useEffect(() => {
    if(props.statusSession === 'qrReadFail'){
      localStorage.setItem('statusSessionMessageButtom', JSON.stringify(false))
      let resultItemLocalStorage = localStorage.getItem('statusSessionMessageButtom')
      resultItemLocalStorage = JSON.parse(localStorage.getItem('statusSessionMessageButtom'))
        props.setStatusSessionMessageButtom(resultItemLocalStorage)
      }
  }, [props.statusSession])

  useEffect(() => {
    let resultItemLocalStorage = localStorage.getItem('statusSessionMessageButtom')
    resultItemLocalStorage = JSON.parse(localStorage.getItem('statusSessionMessageButtom'))
    setMessageButton(resultItemLocalStorage)
  }, [localStorage.getItem('statusSessionMessageButtom')])

  return (
    <>
      <div id='container' style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', alignItems: 'center' }}>
        <div id='column01' style={{ position: 'relative', right: '12px' }}>
          {(props.statusSession === 'notLogged') &&
            <>
              <div id='title' style={{ paddingBottom: '60px', fontSize: '20px', fontFamily: 'sans-serif' }}>Para usar o Whatsapp nesse sistema:</div>
              <div id='step01' style={{ paddingBottom: '20px', fontFamily: 'sans-serif' }}>1. Abra o WhatsApp no seu celular.</div>
              <div id='step02' style={{ paddingBottom: '20px', fontFamily: 'sans-serif' }}>2. Toque em <b>Mais opções</b> ou <b>Configurações</b> e selecione <b>Aparelhos conectados.</b></div>
              <div id='step03' style={{ paddingBottom: '20px', fontFamily: 'sans-serif' }}>3. Aponte seu celular para essa tela para capturar o código.</div>
            </>
          }
          {(props.statusSession === null || props.statusSession === 'qrReadFail') &&
            <Message>
              <Message.Header style={{ paddingTop: '5px', paddingBottom: '10px' }}>
                {props.statusSession === 'qrReadFail' ? <div>A conexão falhou! <div>Isso por ocorrer por falha de conexão com seu smartphone ou com a internet local.</div> Tente novamente.</div> : 'Clique no botão abaixo para realizar a conexão com o Whatsapp!'}
              </Message.Header>
              <Button
                variant="contained"
                color="primary"
                onClick={props.onClickIniciarConexaoWhatsapp}
                startIcon={<MobileOffIcon />}>
                Iniciar conexão! {props.statusSessionMessageButtom === true && (`(Iniciando a conexão, aguarde...)`)}
              </Button>
            </Message>}
        </div>
        <div id='column02'>
          {props.statusSession === 'notLogged' && (props.qr_code_base64 && <img src={props.qr_code_base64} />)}
        </div>
      </div>
    </>
  )
}
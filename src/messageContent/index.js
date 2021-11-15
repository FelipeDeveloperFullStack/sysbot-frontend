import React, { memo, useEffect } from 'react'
/** Semantic */
import { Feed } from 'semantic-ui-react'
import { Message } from 'semantic-ui-react'
/** Material ui */
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar';
import ChatIcon from '@material-ui/icons/Chat';
import Paper from '@material-ui/core/Paper';
/** dayjs */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

function MessageContent(props) {

  useEffect(() => {
    dayjs.extend(relativeTime)
  }, [props.messages])

  return (
    <>
      {props.messages.map(item => {
        return (
          <div style={{ padding: '10px' }}>
            <Feed>
              <Feed.Event>
                <Feed.Label>
                  <Avatar>{String(item.displayName).substr(0, 1)}</Avatar>
                </Feed.Label>
                <Feed.Content>
                  <Feed.Summary>
                    <Feed.User>{item.displayName}</Feed.User> enviou uma mensagem pra você no grupo <a>{item.chatName}</a>
                    <Feed.Date>{`${dayjs(item.created_at).format('DD/MM/YYYY')}`}</Feed.Date>
                  </Feed.Summary>
                  <Feed.Extra text>
                    <Paper elevation={3} style={{ padding: '10px', width: '80vw' }}>
                      {item.body}
                    </Paper>
                  </Feed.Extra>
                  {item.isAnswered === false &&
                    <Feed.Meta style={{ display: 'flex', flexDirection: 'row' }}>
                      {/* <TextField id="filled-basic" label="Digite aqui sua resposta" variant="filled" multiline size='small' style={{ maxWidth: '90%', minWidth: '90%' }} /> */}
                      <Button variant="contained" size='small' startIcon={<ChatIcon />} onClick={() => props.handleButtonResponder({ data: item })}>Responder</Button>
                    </Feed.Meta>}
                  {item.isAnswered === true &&
                    <Message info>
                      <Message.Header>Respondido!</Message.Header>
                    </Message>}
                </Feed.Content>
              </Feed.Event>
            </Feed>
          </div>
        )
      })}



    </>
  )
}

export default memo(MessageContent)
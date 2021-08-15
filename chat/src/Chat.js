import './chat.css'
import { Button, Container, Form, ListGroup, Row } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { FaPaperPlane } from 'react-icons/fa'
import io from 'socket.io-client'
import { v4 as uuid } from 'uuid'

const myId = uuid()
const socket = io('http://localhost:3000')
socket.on('connection', () => console.log('[IO] Connect => A new connection has been estabilished'))


const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat message', function(e) {
      setMessages([...messages, e])
      return () => socket.off('chat message')
    })
     
  }, [messages])

  const onSend = e =>{
    e.preventDefault()

    if (message.trim()) {
        socket.emit( 'chat message', {
            id: myId,
            name: "lucas",
            date: new Date,
            message
        })
        setMessage('');
    }
  }

  const onTyping = (e) => {
    setMessage(e.target.value)
  }

  return (
    <div className="App" >
      <Container>
        <Row className="chat-header row">
          Chat Socket.io
        </Row>
        <Row id="messages" className="chat-messages row">
          <ListGroup id="messages-body" className="messages-body">
            { messages.map((m, index ) => (

              <ListGroup.Item 
                className={`message-${m.id === myId ? 'mine' : 'other' }`} 
                key={index}
              >
                <span>{ m.message }</span>
                <br /><span className="date">{m.date} | {m.name}</span>
              </ListGroup.Item>

            ))}
          </ListGroup>
        </Row>
        <Row className="chat-input row">
          <Form onSubmit={onSend} >
            <Form.Group className="mb-3" >
              <Form.Control as="textarea" rows={3}
                onChange={onTyping}
                value={message}
              />
              <Button className="input-icon" type="submit"/>
            </Form.Group>
          </Form>
        </Row>

      </Container>
    </div>
  );
}

export default Chat;

import React, { Component } from 'react';
import { Widget, addResponseMessage, renderCustomComponent } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';
const uuidv4 = require('uuid/v4');
var guid = uuidv4();
class App extends Component {
  handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    console.log("COnversation id is:"+guid);
    var http = require("http");
    var options = {
      "method": "POST",
      "hostname": "localhost",
      "port": "5005",
      "path": "/webhooks/rest/webhook",
      "headers": {
        "accept": "application/json",
        "content-type": "application/json",
        "sec-fetch-mode": "cors",
        "content-length": "46",
        "Access-Control-Allow-Origin":"*"
      }
    };
    
    var req = http.request(options, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function () {
        var body = Buffer.concat(chunks);
        var json = JSON.parse(body);
        console.log(json);
        json.forEach(entry => {
          if (entry.text != null){
            addResponseMessage(entry.text);
          }
          if (entry.image != null){
            renderCustomComponent(function Image()
            {
              return <div className="ChatImage">
                <img src={entry.image} alt={entry.image}/>
                </div>
            });
          }
        });
      });
    });
    var theJson = JSON.stringify({sender: guid, message: newMessage})
    console.log(theJson)
    req.write(theJson);
    req.end();
  }

  render() {
    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
        />
      </div>
    );
  }
}

export default App;
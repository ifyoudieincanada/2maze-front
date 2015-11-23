function TwoSocket(url) {
  var socket = new WebSocket(url);
  var waiting = true;
  var failed = false;
  var queue = [];
  var defaultPayload = {};

  var count = 0;
  var failure = setInterval(function() {
    if (count === 5000/50) {
      console.log("Connection not established");
      failed = true;
      clearInterval(failure);
    }
    count++;
  }, 50);

  socket.onmessage = function(event) {
    clearInterval(failure);
    var jdata = JSON.parse(event.data);
    if (jdata.status === 'connected') {
      waiting = false;
      defaultPayload.id = jdata.id;
    } else {
      failed = true;
      waiting = false;
      console.log("Error: Response not expected:");
      console.log(event.data);
    }
  };

  var queueInterval = setInterval(function() {
    if (!waiting) {
      if (queue.length > 0) {
        var send = queue.shift();
        send();
      }
    }

    if (failed) {
      clearInterval(queueInterval);
    }
  }, 25);

  this.clear = function() {
    queue = [];
  }

  this.send = function(path, data) {
    if (failed) {
      console.log("Connection not established");
      return;
    }

    queue.push(function() {
      waiting = true;

      var payload = {
        path: path,
        data: data,
        id: defaultPayload['id']
      };

      socket.send(JSON.stringify(payload));

      var count = 0;
      var timeout = setInterval(function() {
        if (count == 1000/50) {
          console.log("Couldn't reach host");
          waiting = false;
          clearInterval(timeout);
        }
        count++;
      }, 50);

      socket.onmessage = function (event) {
        clearInterval(timeout);
        var jdata = JSON.parse(event.data);
        var event;
        if (jdata['error']) {
          jdata['error'];
          event = new CustomEvent('error', { detail: jdata['error'] })
        } else {
          event = new CustomEvent(jdata['name'], { detail: jdata['args'] });
        }
        document.dispatchEvent(event);
        waiting = false;
      };
    });
  };
}

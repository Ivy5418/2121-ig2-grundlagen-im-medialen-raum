# Browser-MQTT-Comunication

This setup allows sending messages through an mqtt broker from web browsers to web browsers.

## Installation

There are two versions of test setups. In `/test_setup_different_clients` is a simple example where two different client scripts are communicating.

This is the version with just one client but you can have multiple browser windows that connect to the socket server. In the terminal:

```bash
cd path/to/test_setup_same_client
npm install
npm run start
```

In your browser go to one of the examples, e.g.:

```
http://localhost:3001/1_example_color_buttons
```


# Rancher 2 Hetzner Cloud UI Driver

[![Build Status](https://travis-ci.org/mxschmitt/ui-driver-hetzner.svg?branch=master)](https://travis-ci.org/mxschmitt/ui-driver-hetzner)

Rancher 2 UI driver for the [Hetzner Cloud](hetzner.de/cloud). For the Rancher 1 version check out the readme from the `v1.6` branch which you can find [here](https://github.com/mxschmitt/ui-driver-hetzner/blob/v1.6/README.md).

## Using

* Add a Machine Driver in Rancher 2 (Global -> Node Drivers)
  * Download URL: `https://github.com/JonasProgrammer/docker-machine-driver-hetzner/releases/download/1.2.2/docker-machine-driver-hetzner_1.2.2_linux_amd64.tar.gz`
  * Custom UI URL: `https://storage.googleapis.com/hcloud-rancher-v2-ui-driver/component.js`
  * Whitelist Domains: `storage.googleapis.com`
* Wait for the driver to become "Active"
* Go to Clusters -> Add Cluster, your driver and custom UI should show up.

![Authentication screen](docs/authentication-screen.png)
![Configuration screen](docs/configuration-screen.png)

## Compatibility

The following `component.js` is always compatible with the latest Rancher 2.X version:

`https://storage.googleapis.com/hcloud-rancher-v2-ui-driver/component.js`

### Rancher 2.0

Use this `component.js` to support Rancher 2.0 version:

`https://storage.googleapis.com/hcloud-rancher-v2-ui-driver/component-v20.js`

## Development

This package contains a small web-server that will serve up the custom driver UI at `http://localhost:3000/component.js`.  You can run this while developing and point the Rancher settings there.
* `npm start`
* The driver name can be optionally overridden: `npm start -- --name=DRIVERNAME`
* The compiled files are viewable at http://localhost:3000.
* **Note:** The development server does not currently automatically restart when files are changed.

## Building

For other users to see your driver, you need to build it and host the output on a server accessible from their browsers.

* `npm run build`
* Copy the contents of the `dist` directory onto a webserver.
  * If your Rancher is configured to use HA or SSL, the server must also be available via HTTPS.


## Docker

* `docker build -t ui-driver .` to build the image. 
* `docker run -p 3000:3000 -v $(pwd)/dist:/app/dist ui-driver` to run it.
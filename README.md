# Rancher 2 Hetzner Cloud UI Driver

Rancher 2.X UI driver for the [Hetzner Cloud](https://www.hetzner.de/cloud) originally by [mxschmitt](https://github.com/mxschmitt/ui-driver-hetzner). This version has been heavily modified in order to support some newer features of Hetzner Cloud and add some basic convenience features.

## Changes from the version by [mxschmitt](https://github.com/mxschmitt/ui-driver-hetzner)

* Support CAX node type and ARM Architecture NodeTemplates
* Filter images based on the selected server type architecture
* Filter networks based on location
* Filter images to app, backup and snapshot - hiding application images
* API Key screen skipped when editing an existing template

## Usage

* Add a Machine Driver in Rancher 2 (`Cluster Management` -> `Drivers` -> `Node Drivers`)

| Key | Value |
| --- | ----- |
| Download URL | `https://github.com/JonasProgrammer/docker-machine-driver-hetzner/releases/download/4.1.2/docker-machine-driver-hetzner_4.1.2_linux_amd64.tar.gz` |
| Custom UI URL | `https://cdn.jsdelivr.net/gh/PeteFromGlasgow/ui-driver-hetzner@gh-pages/component.js` |
| Whitelist Domains |  `cdn.jsdelivr.net` |

* Wait for the driver to become "Active"
* Go to Clusters -> Add Cluster, your driver and custom UI should show up.

![Authentication screen](docs/authentication-screen.png)
![Configuration screen](docs/configuration-screen.png)

## Compatibility

The following `component.js` should be compatible with the latest Rancher 2.X version - I'm planning on implementing some form of versioning later:

`https://cdn.jsdelivr.net/gh/PeteFromGlasgow/ui-driver-hetzner@gh-pages/component.js`

## Tested linux distributions

To use `Debian` e.g. with a non default Storage Driver, you have to set it manually in the Engine Options of the Node Template in Rancher.

### Recommend

| Image        | Docker Version                     | Docker Storage Driver  |
|--------------|------------------------------------|------------------------|
| Ubuntu 22.04 | 23.0                               | overlay2 (default)     |
## Development

This package contains a small web-server that will serve up the custom driver UI at `http://localhost:3000/component.js`. You can run this while developing and point the Rancher settings there.
* `npm start`
* The driver name can be optionally overridden: `npm start -- --name=DRIVERNAME`
* The compiled files are viewable at http://localhost:3000.
* **Note:** The development server does not currently automatically restart when files are changed.

## Building

For other users to see your driver, you need to build it and host the output on a server accessible from their browsers.

* `npm run build`
* Copy the contents of the `dist` directory onto a webserver.
  * If your Rancher is configured to use HA or SSL, the server must also be available via HTTPS.

## Useful resources

### `Error creating machine: Error running provisioning: ssh command error:`

Try to use `overlay2` and if it does not work `overlay` as `Storage Driver` in the `Engine Options` in the bottom.

### How secure is the `Private Network` feature?

> Traffic between Cloud Servers inside a Network is private and isolated, but not automatically encrypted. We recommend you use TLS or similar protocols to encrypt sensitive traffic.

Reference: [Hetzner Cloud documentation](https://wiki.hetzner.de/index.php/CloudServer/en#Is_traffic_inside_Hetzner_Cloud_Networks_encrypted.3F)

The Rancher traffic between the agents and the Rancher related traffic to the nodes is fully encrypted over HTTPS/TLS.

The custom application specific traffic is *not* encrypted. You can use e.g. the Weave CNI-Provider for that: https://rancher.com/docs/rancher/v2.x/en/faq/networking/cni-providers/#weave

### Requirements for Private Networks

- Rancher host needs to be in the *same Private Network* as the selected one in the Node template
- Under the global settings of Rancher the `server-url` needs to be the internal IP of the Private Network (you can find it in the Hetzner Cloud Console). Otherwise the traffic won't go through the Internal network.

### How to close the open ports on the public interface?

You could use it e.g. in combination with that tool: https://github.com/vitobotta/hetzner-cloud-init

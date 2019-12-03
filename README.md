# Light Show Game Server
## rhabdomancer
Rhabdomancy is a divination technique which involves the use of any rod, staff, stick, arrow, or the like. 

In other words, magical wands. 

### Overview
This repository contains the server for interactive light show wand game. It can also be extended to play game on the light show. 

This repository is split into two parts, the client and the server. 

#### Server
The server maintains the state, communicates with Gallium, manages users, and serves the client files for games. It uses node.js.

To generate SSL certificates, use 

#### Client
The client 

### SSL Certificates
Since iOS requires the client to be running in a secure context before releasing motion data, the entire stack needs to be secured. The game server has HTTPS baked in, but requires the certificates to be stored in `certificates/cert.pem` and `certificates/key.pem`. There are two options for creating these certificates.

#### Localhost
https://github.com/FiloSottile/mkcert

`mkcert -install`
`mkcert localhost 127.0.0.1 10.0.0.7 ::1`

For mobile, mkcert will create a root certificate that you must deliver to the phone. For iOS, this is as easy as airdropping and clicking Trust. After installing it, you must enable full trust in it.  https://support.apple.com/en-nz/HT20447

#### Let's Encrypt

For Let's Encrypt, which provides free SSL certificates with an already trusted CA (don't need to trust the root certificate above), you'll need an actual server running. I followed this guide on an azure virtual machine https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca 


`sudo add-apt-repository ppa:certbot/certbot`
`sudo apt-get update`
`sudo apt-get install certbot`

Generating the SSL certificate.
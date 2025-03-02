# Home Alarm
Node app for my alarm system

# Instructions

- Create a `personal.config.yml` with all settings in the helm directory. (Copy sample.yml as an example)
- Copy any audio files referenced in `personal.config.yml` into a `frontend/public/audio` directory
- Build the frontend and backend with `npm run clean` and `npm run build` in the base directory
- Create image with `sudo podman build . -t home-alarm`
- Output image as tar with `sudo podman save --output alarm.tar localhost/home-alarm`
- Transfer to cluster
- Import with `sudo k3s ctr images import alarm.tar`
- Create a secret pin with `kubectl create secret generic home-alarm-pin --from-literal='alarm-pin=1234'`
- If using Pushover, create a secret user/token with `kubectl create secret generic home-alarm-pushover --from-literal='pushover-user=abcd' --from-literal='pushover-token=abcd'`
- Install with helm from the helm dir: `helm install home-alarm .` 

# SSL NOTE: You MUST use 2048 due to konnected limitations
openssl req -x509 -newkey rsa:2048 -sha256 -days 3650 \
  -nodes -keyout server.key -out server.crt -subj "/CN=example.com" \
  -addext "subjectAltName=DNS:example.com,DNS:*.example.com,IP:10.0.0.1"
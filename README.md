Made changes to the wobb interface.


## Troubleshooting for macOS Users (Apple Silicon)

If you are on an M1/M2/M3 Mac and encounter a macOS security pop-up stating **"rolldown-binding.darwin-arm64.node can’t be opened because Apple cannot check it for malicious software"**, you need to clear the macOS quarantine flag on the downloaded dependencies.

Run the following command in your terminal from the project root:

```bash
xattr -cr node_modules